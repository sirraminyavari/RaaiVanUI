const toggleTemplate = (state, template) => {
  const exist = state.templates.includes(template);

  if (exist) {
    const filtered = state.templates.filter((x) => x !== template);
    return { ...state, templates: filtered };
  } else {
    return { ...state, templates: [...state.templates, template] };
  }
};

export const stepperReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIRST_NAME':
      return { ...state, firstName: action.firstName };
    case 'SET_Last_NAME':
      return { ...state, lastName: action.lastName };
    case 'SET_AVATAR':
      return { ...state, avatar: action.avatar };
    case 'SET_TEAM_NAME':
      return { ...state, teamName: action.teamName };
    case 'REMOVE_AVATAR':
      return { ...state, avatar: '' };
    case 'SET_TEAM_MEMBERS':
      return { ...state, members: action.members };
    case 'SET_FIELD':
      return { ...state, field: action.field };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'TOGGLE_TEMPLATE':
      return toggleTemplate(state, action.template);
    default:
      return state;
  }
};
