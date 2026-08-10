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
  hintText: string = "Drag a wedge to cover every angle"

  @input
  @hint("Text size (world-space em units; ~60 reads at 2 m)")
  @widget(new SliderWidget(30, 100, 1))
  textSize: number = 60
  @ui.group_end

  private text: Text | null = null
  private fading: boolean = false

  onAwake(): void {
    const t = this.sceneObject.createComponent("Component.Text") as Text
    t.text = this.hintText
    t.size = this.textSize
    t.depthTest = true
    t.horizontalOverflow = HorizontalOverflow.Overflow
    t.textFill.color = new vec4(1, 1, 1, 0.92)
    this.text = t
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
      const a = Math.max(0, 0.92 * (1 - elapsed / d))
      this.text!.textFill.color = new vec4(1, 1, 1, a)
      if (elapsed >= d) {
        anim.enabled = false
        this.sceneObject.enabled = false
      }
    })
  }
}
