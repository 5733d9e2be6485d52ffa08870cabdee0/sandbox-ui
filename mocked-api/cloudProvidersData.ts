export const cloudProvidersData = [
  {
    kind: "CloudProvider",
    id: "aws",
    name: "aws",
    href: "/api/v1/cloud_providers/aws",
    display_name: "Amazon Web Services",
    enabled: true,
  },
];

export const cloudRegions: {
  [key: string]: {
    kind: string;
    name: string;
    display_name: string;
    enabled: boolean;
  }[];
} = {
  aws: [
    {
      kind: "CloudRegion",
      name: "us-east-1",
      display_name: "US East, N. Virginia",
      enabled: true,
    },
  ],
};
