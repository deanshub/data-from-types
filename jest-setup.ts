expect.extend({
  toHavePropertyOfType(received, name, type) {
    const pass =
      received.hasOwnProperty(name) && typeof received[name] === type;
    return {
      pass,
      message: () =>
        `property "${name}" does not match type "${type}" on ${JSON.stringify(
          received,
          null,
          2
        )}\ntype sould be "${type}" but got "${typeof received[name]}"`
    };
  }
});
