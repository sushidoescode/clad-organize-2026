import { FlexLayout } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout"
import { FlexItem } from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem"
import {
  FlexAlign,
  FlexDirection,
  FlexJustify,
} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes"
import { BackPlate } from "SpectaclesUIKit.lspkg/Scripts/BackPlate"
import { Button } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button"
import { ElementContent } from "SpectaclesUIKit.lspkg/Scripts/Components/Content/ElementContent"
import { Billboard } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard"
import Event, { PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event"

const LAYOUT_Z_LIFT = 0.02
const CONTENT_Z = 0.6

// Type scale (Far / z=-110). ElementContent has no weight setter — size only.
const TYPE_SCALE: { [role: string]: number } = {
  Button: 39,
  Body: 39,
  Caption: 38,
}
const FONT_SIZE_SCALE = 1.0
function roleSize(role: string): number {
  return (TYPE_SCALE[role] ?? 39) * FONT_SIZE_SCALE
}

/**
 * CompassUI — minimal control panel for the Shot Coverage Compass:
 * a single UIKit Reset button on a BackPlate. Exposes onReset for
 * CompassRoot to subscribe to. Billboarded toward the user.
 */
@component
export class CompassUI extends BaseScriptComponent {
  @ui.label("Compass Control Panel")
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Label shown on the reset button")
  labelText: string = "Reset"

  @input
  @hint("Button width in cm (min 5.5 for a 5-char label)")
  @widget(new SliderWidget(5.5, 16, 0.5))
  buttonWidth: number = 10

  @input
  @hint("Button height in cm (min 4 cm touch target)")
  @widget(new SliderWidget(4, 8, 0.5))
  buttonHeight: number = 4.5
  @ui.group_end

  private _onReset: Event<void> = new Event<void>()
  public get onReset(): PublicApi<void> {
    return this._onReset.publicApi()
  }

  onAwake(): void {
    this.sceneObject.createComponent("Component.Canvas")

    const backPlate = this.sceneObject.createComponent(
      BackPlate.getTypeName()
    ) as BackPlate

    const content = this.obj(this.sceneObject, "Content", new vec3(0, 0, CONTENT_Z))
    const col = this.flexColumn(content, this.buttonWidth + 2, this.buttonHeight + 2, {
      justify: FlexJustify.Center,
      align: FlexAlign.Center,
      padY: 1,
      padX: 1,
    })

    this.flexChild(col, { w: this.buttonWidth, h: this.buttonHeight }, (btnObj) => {
      const btn = btnObj.createComponent(Button.getTypeName()) as Button
      btn.onInitialized.add(() => {
        btn.size = new vec3(this.buttonWidth, this.buttonHeight, 1)
      })
      const ec = btnObj.createComponent(
        ElementContent.getTypeName()
      ) as ElementContent
      ec.text = this.labelText
      ec.textSize = roleSize("Button")
      ec.contentAlignment = "center"
      btn.onTriggerUp.add(() => {
        this._onReset.invoke()
      })
    })

    const flexLayout = col.getComponent(FlexLayout.getTypeName()) as FlexLayout
    flexLayout.onLayoutComplete.add((r) => {
      backPlate.size = new vec2(r.containerWidth, r.containerHeight)
    })

    this.sceneObject.createComponent(Billboard.getTypeName())
  }

  private obj(parent: SceneObject, name: string, position?: vec3): SceneObject {
    const sceneObject = global.scene.createSceneObject(name)
    sceneObject.setParent(parent)
    if (position) {
      sceneObject.getTransform().setLocalPosition(position)
    }
    return sceneObject
  }

  private liftInZ(sceneObject: SceneObject, zOffset: number): void {
    const transform = sceneObject.getTransform()
    const pos = transform.getLocalPosition()
    transform.setLocalPosition(new vec3(pos.x, pos.y, pos.z + zOffset))
  }

  private flexColumn(
    parent: SceneObject,
    width: number,
    height: number,
    opts?: { gap?: number; padY?: number; padX?: number; justify?: FlexJustify; align?: FlexAlign }
  ): SceneObject {
    const container = this.obj(parent, "Flex")
    this.liftInZ(container, LAYOUT_Z_LIFT)
    const flexLayout = container.createComponent(FlexLayout.getTypeName()) as FlexLayout
    const flexItem = container.createComponent(FlexItem.getTypeName()) as FlexItem
    if (width > 0) {
      flexItem.overrideWidth = width
    }
    if (height > 0) {
      flexItem.overrideHeight = height
    }
    flexLayout.onInitialized.add(() => {
      flexLayout.width = width
      flexLayout.height = height
      flexLayout.direction = FlexDirection.Column
      flexLayout.rowGap = opts?.gap ?? 0
      flexLayout.paddingTop = opts?.padY ?? 0
      flexLayout.paddingBottom = opts?.padY ?? 0
      flexLayout.paddingLeft = opts?.padX ?? 0
      flexLayout.paddingRight = opts?.padX ?? 0
      flexLayout.justifyContent = opts?.justify ?? FlexJustify.Start
      flexLayout.alignItems = opts?.align ?? FlexAlign.Stretch
    })
    return container
  }

  private flexChild(
    parent: SceneObject,
    size: { w?: number; h?: number; grow?: number },
    builder: (childObject: SceneObject) => void
  ): SceneObject {
    const child = this.obj(parent, "Item")
    this.liftInZ(child, LAYOUT_Z_LIFT)
    const flexItem = child.createComponent(FlexItem.getTypeName()) as FlexItem
    if (size.w !== undefined && size.w > 0) {
      flexItem.overrideWidth = size.w
    }
    if (size.h !== undefined && size.h > 0) {
      flexItem.overrideHeight = size.h
    }
    flexItem.flexGrow = size.grow ?? 0
    flexItem.flexShrink = 0

    builder(child)

    // Content is built in onAwake, before FlexLayout's own start — its default
    // autoDiscoverItemsOnStart picks these FlexItems up; addItems() pre-init throws.
    return child
  }
}
