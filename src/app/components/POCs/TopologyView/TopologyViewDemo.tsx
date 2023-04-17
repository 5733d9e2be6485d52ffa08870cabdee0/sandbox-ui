import * as React from "react";
import { RegionsIcon as Icon4 } from "@patternfly/react-icons";
import { DataSourceIcon as Icon1 } from "@patternfly/react-icons";
import { DataSinkIcon as Icon2 } from "@patternfly/react-icons";
import { DataProcessorIcon as Icon3 } from "@patternfly/react-icons";
import {
  action,
  BreadthFirstLayout,
  ColaLayout,
  ConcentricLayout,
  createTopologyControlButtons,
  DagreLayout,
  defaultControlButtonsOptions,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  Edge,
  EdgeTerminalType,
  ForceLayout,
  GraphComponent,
  GridLayout,
  ModelKind,
  SELECTION_EVENT,
  TopologyControlBar,
  TopologySideBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withPanZoom,
  withSelection,
  WithSelectionProps,
  ComponentFactory,
  Graph,
  Layout,
  LayoutFactory,
  Model,
  Node,
  ElementModel,
} from "@patternfly/react-topology";
import { Topology } from "./Topology";
import NodeInformation from "./NodeInformation";

export interface TopologyViewDemoProps {
  layout: Topology["layout"];
  NODES: Topology["NODES_12"];
  EDGES: Topology["EDGES_12"];
  truncateLength: number;
}

interface CustomNodeProps {
  element: Node;
}
interface DataEdgeProps {
  element: Edge;
}

let setTruncateLength: number;

const DataEdge: React.FC<DataEdgeProps> = ({ element, ...rest }) => (
  <DefaultEdge
    element={element}
    startTerminalType={EdgeTerminalType.cross}
    endTerminalType={EdgeTerminalType.directionalAlt}
    {...rest}
  />
);
export interface NodeModel extends Omit<ElementModel, "data"> {
  data: {
    type: string;
    owner: string;
    TimeCreated: string;
    TimeUpdated: string;
  };
}

const CustomNode: React.FC<CustomNodeProps & WithSelectionProps> = ({
  element,
  onSelect,
  selected,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: NodeModel = element.getData();
  let Icon;
  if (data.type == "Source") {
    Icon = Icon1;
  } else if (data.type == "Sink") {
    Icon = Icon2;
  } else if (data.type == "Processor") {
    Icon = Icon3;
  } else {
    Icon = Icon4;
  }

  return (
    <DefaultNode
      element={element}
      showStatusDecorator
      {...rest}
      truncateLength={setTruncateLength}
      onSelect={onSelect}
      selected={selected}
    >
      <g transform={`translate(25, 25)`}>
        <Icon style={{ color: "#393F44" }} width={25} height={25} />
      </g>
    </DefaultNode>
  );
};

const customLayoutFactory: LayoutFactory = (
  type: string,
  graph: Graph
): Layout | undefined => {
  switch (type) {
    case "Cola":
      return new ColaLayout(graph, {
        layoutOnDrag: false,
        linkDistance: 10,
        collideDistance: 30,
        maxTicks: 1,
        groupDistance: 150,
      });
    case "Dagre_network-simplex":
      return new DagreLayout(graph, {
        rankdir: "LR",
        nodesep: 10,
        linkDistance: 5,
        edgesep: 2,
        groupDistance: 150,
        ranker: "network-simplex",
        // collideDistance: 30,
      });
    case "Dagre_tight-tree":
      return new DagreLayout(graph, {
        rankdir: "LR",
        nodesep: 10,
        linkDistance: 5,
        edgesep: 2,
        groupDistance: 150,
        ranker: "tight-tree",
        // collideDistance: 30,
      });
    case "BreadthFirst":
      return new BreadthFirstLayout(graph, {
        // linkDistance: 10,
        // collideDistance: 30,
        // groupDistance: 650,
        nodeDistance: 80,
      });
    case "Concentric":
      return new ConcentricLayout(graph, {
        // linkDistance: 10,
        // collideDistance: 30,
        groupDistance: 150,
      });
    case "Grid":
      return new GridLayout(graph, {
        // linkDistance: 10,
        // collideDistance: 30,
        groupDistance: 150,
        nodeDistance: 75,
      });
    default:
      return new ForceLayout(graph, {
        // linkDistance: 10,
        // collideDistance: 30,
        groupDistance: 150,
      });
  }
};

const customComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string
): any => {
  switch (type) {
    case "group":
      return DefaultGroup;
    case "data-edge":
      return DataEdge;
    default:
      switch (kind) {
        case ModelKind.graph:
          return withPanZoom()(GraphComponent);
        case ModelKind.node:
          return withSelection()(CustomNode);
        case ModelKind.edge:
          return DefaultEdge;
        default:
          return undefined;
      }
  }
};

const TopologyViewDemo = (props: TopologyViewDemoProps): JSX.Element => {
  const { layout, NODES, EDGES, truncateLength } = props;
  setTruncateLength = truncateLength;
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const controller = React.useMemo(() => {
    const model: Model = {
      nodes: NODES,
      edges: EDGES,
      graph: {
        id: "g1",
        type: "graph",
        layout,
      },
    };

    const newController = new Visualization();
    newController.setFitToScreenOnLayout(true);
    newController.registerLayoutFactory(customLayoutFactory);
    newController.registerComponentFactory(customComponentFactory);

    newController.addEventListener(SELECTION_EVENT, setSelectedIds);

    newController.fromModel(model, false);

    return newController;
  }, [EDGES, NODES, layout]);

  const topologySideBar = (
    <TopologySideBar
      className="topology-example-sidebar"
      show={selectedIds.length > 0}
      onClose={(): void => setSelectedIds([])}
    >
      <NodeInformation nodeId={selectedIds[0]} />
    </TopologySideBar>
  );

  return (
    <TopologyView
      sideBar={topologySideBar}
      controlBar={
        <TopologyControlBar
          controlButtons={createTopologyControlButtons({
            ...defaultControlButtonsOptions,
            zoomInCallback: action(() => {
              controller.getGraph().scaleBy(4 / 3);
            }),
            zoomOutCallback: action(() => {
              controller.getGraph().scaleBy(0.75);
            }),
            fitToScreenCallback: action(() => {
              controller.getGraph().fit(80);
            }),
            resetViewCallback: action(() => {
              controller.getGraph().reset();
              controller.getGraph().layout();
            }),
            legend: false,
          })}
        />
      }
    >
      <VisualizationProvider controller={controller}>
        <VisualizationSurface state={{ selectedIds }} />
      </VisualizationProvider>
    </TopologyView>
  );
};

export default TopologyViewDemo;
