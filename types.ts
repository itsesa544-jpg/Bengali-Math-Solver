
export enum InputTab {
  Text = 'text',
  File = 'file',
  Camera = 'camera',
}

export enum OutputFormat {
  Detailed = 'detailed',
  Brief = 'brief',
}

export interface GraphSolution {
  isGraph: true;
  explanation: string;
  graphImage: string; // base64 data URL
}

export type Solution = string | GraphSolution | null;

export interface HistoryItem {
  id: string;
  problemInput: string;
  imagePreview?: string;
  solution: Solution;
}
