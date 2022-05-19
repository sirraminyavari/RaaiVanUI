import { decodeBase64 } from 'helpers/helpers';

export const decodeService = (service: any) => ({
  ...(service || {}),
  TypeName: decodeBase64(service?.TypeName),
  Title: decodeBase64(service?.Title),
  Description: decodeBase64(service?.Description),
  SuccessMessage: decodeBase64(service?.SuccessMessage),
  AdminLimits: (service?.AdminLimits || []).map((l) => ({
    ...l,
    Name: decodeBase64(l.Name),
  })),
  ContributionLimits: (service?.ContributionLimits || []).map((l) => ({
    ...l,
    Name: decodeBase64(l.Name),
  })),
});

export const decodeExtension = (extension: any) => ({
  ...(extension || {}),
  Title: decodeBase64(extension?.Title),
});

export const decodeNodeType = (nodeType: any) => ({
  ...(nodeType || {}),
  AdditionalID: decodeBase64(nodeType?.AdditionalID),
  TypeName: decodeBase64(nodeType?.TypeName),
  Description: decodeBase64(nodeType?.Description),
  Sub: (nodeType?.Sub || []).map((s) => decodeNodeType(s)),
});

export const decodeNode = (node: any) => ({
  ...(node || {}),
  AdditionalID: decodeBase64(node?.AdditionalID),
  Name: decodeBase64(node?.Name),
  NodeType: decodeBase64(node?.NodeType),
  AvatarName: decodeBase64(node?.AvatarName),
  WFState: decodeBase64(node?.WFState),
});

export const decodeKnowledgeType = (type: any) => ({
  ...(type || {}),
  CandidateRelations: {
    NodeTypes: (type?.CandidateRelations?.NodeTypes || []).map((tp) =>
      decodeNodeType(tp)
    ),
    Nodes: (type?.CandidateRelations?.Nodes || []).map((tp) => decodeNode(tp)),
  },
  TextOptions: decodeBase64(type.TextOptions),
});
