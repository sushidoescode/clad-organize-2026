import { scenariosIndex } from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator"
import { ScenarioMetadata } from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata"
import { CompassEngineScenario } from "./CompassEngineScenario"
import { CompassDragScenario } from "./CompassDragScenario"
import { CompassPersistenceScenario } from "./CompassPersistenceScenario"
import { CompassResetScenario } from "./CompassResetScenario"
import { CompassIKResetScenario } from "./CompassIKResetScenario"

@component
export class LeafIndex extends BaseScriptComponent {
  @scenariosIndex
  static scenariosIndex: ScenarioMetadata[] = [
    {
      id: "compass-engine-math",
      typename: CompassEngineScenario.getTypeName(),
    },
    {
      id: "compass-drag-coverage",
      typename: CompassDragScenario.getTypeName(),
    },
    {
      id: "compass-persistence",
      typename: CompassPersistenceScenario.getTypeName(),
    },
    {
      id: "compass-reset",
      typename: CompassResetScenario.getTypeName(),
    },
    // Reachability probe — environment-sensitive (IK-rig infra), not part of
    // the deterministic core gate. See the scenario's doc comment.
    {
      id: "compass-ik-reach",
      typename: CompassIKResetScenario.getTypeName(),
    },
  ]
}
