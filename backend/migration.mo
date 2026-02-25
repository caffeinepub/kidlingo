module {
  type OldActor = { /* old state if any changes were made */ };
  type NewActor = { /* new state if any changes were made */ };
  // No data transformation needed, returns old state as is
  public func run(old : OldActor) : NewActor { old };
};
