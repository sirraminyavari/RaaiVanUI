const toggleTemplate = (state, template) => {
  const exist = state.templates.find((x) => x.id === template.id);

  console.log(exist);

  if (!!exist) {
    const filtered = state.templates.filter((x) => x.id !== template.id);
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
      return {
        ...state,
        teamName: action.teamName,
        applicationId: action.applicationId,
        step: state.step + 1,
      };
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
    case 'ACTIVATE_TEMPLATE':
      return {
        ...state,
        activatedTemplates: [...state.activatedTemplates, action.template],
      };
    case 'TOGGLE_LOADING':
      return { ...state, loading: !state.loading };
    default:
      return state;
  }
};
