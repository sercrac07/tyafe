import type { Issue } from "./types";

export class TyafeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TyafeError";
  }
}

export class TyafeIssue extends Error {
  public issues: Issue[];

  constructor(issues: Issue[]) {
    super("Issues where found while parsing an schema");
    this.name = "TyafeIssue";
    this.issues = issues;
  }
}
