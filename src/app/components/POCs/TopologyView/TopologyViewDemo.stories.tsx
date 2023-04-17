import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import TopologyViewDemo from "./TopologyViewDemo";
import {
  EDGES_12,
  EDGES_6,
  NODES_12,
  NODES_12_Without_Edges,
  NODES_6,
} from "./Topology";

export default {
  title: "PoCs/Topology View",
  component: TopologyViewDemo,
} as ComponentMeta<typeof TopologyViewDemo>;

const Template: ComponentStory<typeof TopologyViewDemo> = (args) => (
  <TopologyViewDemo {...args} />
);

export const DagreLayout_6_nodes = Template.bind({});
DagreLayout_6_nodes.args = {
  layout: "Dagre_network-simplex",
  NODES: NODES_6,
  EDGES: EDGES_6,
};

export const DagreLayout_12_nodes_with_tight_tree_algorithm = Template.bind({});
DagreLayout_12_nodes_with_tight_tree_algorithm.args = {
  layout: "Dagre_tight-tree",
  NODES: NODES_12,
  EDGES: EDGES_12,
  truncateLength: 0,
};

export const DagreLayout_12_nodes_with_Network_simplex_algorithm =
  Template.bind({});
DagreLayout_12_nodes_with_Network_simplex_algorithm.args = {
  layout: "Dagre_network-simplex",
  NODES: NODES_12,
  EDGES: EDGES_12,
  truncateLength: 0,
};

export const BreadthFirstLayout_6_nodes = Template.bind({});
BreadthFirstLayout_6_nodes.args = {
  layout: "BreadthFirst",
  NODES: NODES_6,
  EDGES: EDGES_6,
};

export const BreadthFirstLayout_12_nodes = Template.bind({});
BreadthFirstLayout_12_nodes.args = {
  layout: "BreadthFirst",
  NODES: NODES_12,
  EDGES: EDGES_12,
};

export const ColaLayout_Without_Edges = Template.bind({});
ColaLayout_Without_Edges.args = {
  layout: "Cola",
  NODES: NODES_12_Without_Edges,
  EDGES: [],
  truncateLength: 0,
};
