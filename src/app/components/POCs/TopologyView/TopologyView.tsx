import React from "react";
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
  TopologyView as PFTopologyView,
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
  EdgeModel,
  NodeModel,
} from "@patternfly/react-topology";

import NodeInformation from "./NodeSideBarDetails";

export interface TopologyViewDemoProps {
  layout: string;
  nodes: NodeModel[];
  edges: EdgeModel[];
  truncateLength?: number;
}

interface CustomNodeProps {
  element: Node;
}
interface DataEdgeProps {
  element: Edge;
}

const DataEdge: React.FC<DataEdgeProps> = ({ element, ...rest }) => (
  <DefaultEdge
    element={element}
    startTerminalType={EdgeTerminalType.cross}
    endTerminalType={EdgeTerminalType.directionalAlt}
    {...rest}
  />
);

const CustomNode: React.FC<CustomNodeProps & WithSelectionProps> = ({
  element,
  onSelect,
  selected,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = element.getData();
  let Icon;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (data.type == "Source") {
    Icon = Icon1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  } else if (data.type == "Sink") {
    Icon = Icon2;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      truncateLength={data.length}
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
      });
    case "Dagre_tight-tree":
      return new DagreLayout(graph, {
        rankdir: "LR",
        nodesep: 10,
        linkDistance: 5,
        edgesep: 2,
        groupDistance: 150,
        ranker: "tight-tree",
      });
    case "BreadthFirst":
      return new BreadthFirstLayout(graph, {
        nodeDistance: 80,
      });
    case "Concentric":
      return new ConcentricLayout(graph, {
        groupDistance: 150,
      });
    case "Grid":
      return new GridLayout(graph, {
        groupDistance: 150,
        nodeDistance: 75,
      });
    default:
      return new ForceLayout(graph, {
        groupDistance: 250,
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
          return withSelection()(CustomNode as React.FC);
        case ModelKind.edge:
          return DefaultEdge;
        default:
          return undefined;
      }
  }
};

const TopologyView = (props: TopologyViewDemoProps): JSX.Element => {
  const { layout, nodes, edges, truncateLength } = props;

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const controller = React.useMemo(() => {
    nodes.map((node) => {
      node.data && Object.assign(node?.data, { length: truncateLength });
    });

    const model: Model = {
      nodes: nodes,
      edges: edges,
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
  }, [edges, layout, nodes, truncateLength]);

  const node = nodes.find((node) => node.id === selectedIds[0]);

  const topologySideBar = (
    <TopologySideBar
      className="topology-example-sidebar"
      show={selectedIds.length > 0}
      onClose={(): void => setSelectedIds([])}
    >
      <NodeInformation node={node} />
    </TopologySideBar>
  );

  return (
    <PFTopologyView
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
    </PFTopologyView>
  );
};

export default TopologyView;
