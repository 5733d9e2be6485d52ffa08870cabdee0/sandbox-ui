import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import TopologyView from "./TopologyView";
import {
  EDGES_12,
  EDGES_6,
  NODES_12,
  NODES_12_Without_Edges,
  NODES_6,
} from "./topologyStoriesHelper";

export default {
  title: "PoCs/Topology View",
  component: TopologyView,
} as ComponentMeta<typeof TopologyView>;

const Template: ComponentStory<typeof TopologyView> = (args) => (
  <TopologyView {...args} />
);

export const DagreLayout_6_nodes = Template.bind({});
DagreLayout_6_nodes.args = {
  layout: "Dagre_network-simplex",
  nodes: NODES_6,
  edges: EDGES_6,
};

export const DagreLayout_12_nodes_with_tight_tree_algorithm = Template.bind({});
DagreLayout_12_nodes_with_tight_tree_algorithm.args = {
  layout: "Dagre_tight-tree",
  nodes: NODES_12,
  edges: EDGES_12,
};

export const DagreLayout_12_nodes_with_Network_simplex_algorithm =
  Template.bind({});
DagreLayout_12_nodes_with_Network_simplex_algorithm.args = {
  layout: "Dagre_network-simplex",
  nodes: NODES_12,
  edges: EDGES_12,
};

export const BreadthFirstLayout_6_nodes = Template.bind({});
BreadthFirstLayout_6_nodes.args = {
  layout: "BreadthFirst",
  nodes: NODES_6,
  edges: EDGES_6,
};

export const BreadthFirstLayout_12_nodes = Template.bind({});
BreadthFirstLayout_12_nodes.args = {
  layout: "BreadthFirst",
  nodes: NODES_12,
  edges: EDGES_12,
};

export const ColaLayout_Without_Edges = Template.bind({});
ColaLayout_Without_Edges.args = {
  layout: "Cola",
  nodes: NODES_12_Without_Edges,
  edges: [],
};
