module.exports = (existingCommand, localCommand) => {

  // Check if command choices are different
  const areChoicesDifferent = (existingChoices, localChoices) => {

    // For each choice, check if not equal to existing choice. Return true if not, false if all equal to existing choices
    for (const localChoice of localChoices) {
      const existingChoice = existingChoices?.find(
        (choice) => choice.name === localChoice.name
      );

      if (!existingChoice) {
        return true;
      }

      if (localChoice.value !== existingChoice.value) {
        return true;
      }
    }
    return false;
  };

  // Check if command options are different
  const areOptionsDifferent = (existingOptions, localOptions) => {

    // For each option, check name, description, type, required, and choices. If anything is not the same, return true. Otherwise, if all are the same, return false
    for (const localOption of localOptions) {
      const existingOption = existingOptions?.find(
        (option) => option.name === localOption.name
      );

      if (!existingOption) {
        return true;
      }

      if (
        localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type ||
        (localOption.required || false) !== existingOption.required ||
        (localOption.choices?.length || 0) !==
          (existingOption.choices?.length || 0) ||
        areChoicesDifferent(
          localOption.choices || [],
          existingOption.choices || []
        )
      ) {
        return true;
      }
    }
    return false;
  };

  // Check if command descriptions and options are the same. If not, return true. If all are the same, return false
  if (
    existingCommand.description !== localCommand.description ||
    existingCommand.options?.length !== (localCommand.options?.length || 0) ||
    areOptionsDifferent(existingCommand.options, localCommand.options || [])
  ) {
    return true;
  }

  return false;
};