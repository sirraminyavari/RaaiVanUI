import type { SVGProps } from 'react';
import { IoGitNetwork } from 'react-icons/io5';

interface IWorkflowIcon extends SVGProps<SVGSVGElement> {
  size?: string;
}

function WorkflowIcon({ ...props }: IWorkflowIcon): JSX.Element {
  return <IoGitNetwork {...props} />;
}

WorkflowIcon.displayName = 'WorkflowIcon';
export default WorkflowIcon;
