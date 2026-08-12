import { Billboard } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard"

/**
 * One-sentence onboarding beat, shown where the action starts (above the
 * tray). Display-only — no interaction. CompassRoot dismisses it on the
 * first wedge manipulation; it fades out and disables itself.
 */
@component
export class OnboardingHint extends BaseScriptComponent {
  @ui.label("Onboarding Hint")
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("The single onboarding instruction")
  hintText: string = "DRAG WEDGES INTO THE ARC · GREEN = COVERED"

  @input
  @hint("Smaller purpose line under the instruction — the 'why' for a cold viewer")
  subText: string = "PLAN CAMERA ANGLES AROUND YOUR SUBJECT"

  @input
  @hint("Text size (world-space em units; ~60 reads at 2 m)")
  @widget(new SliderWidget(30, 100, 1))
  textSize: number = 60
  @ui.group_end

  private text: Text | null = null
  private sub: Text | null = null
  private fading: boolean = false

  onAwake(): void {
    const t = this.sceneObject.createComponent("Component.Text") as Text
    t.text = this.hintText
    t.size = this.textSize
    t.depthTest = true
    t.horizontalOverflow = HorizontalOverflow.Overflow
    t.textFill.color = new vec4(0.937, 0.902, 0.839, 0.92)
    this.text = t

    const subObj = global.scene.createSceneObject("HintSub")
    subObj.setParent(this.sceneObject)
    subObj.getTransform().setLocalPosition(new vec3(0, -13, 0))
    const s = subObj.createComponent("Component.Text") as Text
    s.text = this.subText
    s.size = this.textSize * 0.62
    s.depthTest = true
    s.horizontalOverflow = HorizontalOverflow.Overflow
    s.textFill.color = new vec4(0.937, 0.902, 0.839, 0.7)
    this.sub = s

    this.sceneObject.createComponent(Billboard.getTypeName())
  }

  public dismiss(): void {
    if (this.fading || this.text === null) {
      return
    }
    this.fading = true
    let elapsed = 0
    const anim = this.createEvent("UpdateEvent")
    anim.bind(() => {
      elapsed += getDeltaTime()
      const d = 0.8
      const k = Math.max(0, 1 - elapsed / d)
      this.text!.textFill.color = new vec4(0.937, 0.902, 0.839, 0.92 * k)
      if (this.sub) {
        this.sub.textFill.color = new vec4(0.937, 0.902, 0.839, 0.7 * k)
      }
      if (elapsed >= d) {
        anim.enabled = false
        this.sceneObject.enabled = false
      }
    })
  }
}
