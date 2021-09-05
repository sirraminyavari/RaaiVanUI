const getRecordDate = () => {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()} - ${date.toLocaleDateString(
    'fa'
  )}`;
};
const grades = ['first', 'second', 'third', 'fourth', 'fifth'];

const singleOptions = grades.map((x) => ({
  value: `single-${x}`,
  label: `گزینه تک انتخابی ${x}`,
}));

const multiOptions = grades.map((x) => ({
  value: `multi-${x}`,
  label: `گزینه چند انتخابی ${x}`,
}));

const getDeafultValues = (count = 1) => {
  let i = 0;
  let defaultValues = [];
  while (i < count) {
    let randomNumber = Math.floor(Math.random() * 5);
    if (count === 1) {
      defaultValues.push({
        value: `single-${grades[randomNumber]}`,
        label: `گزینه تک انتخابی ${grades[randomNumber]}`,
      });
    } else {
      defaultValues.push({
        value: `multi-${grades[randomNumber]}`,
        label: `گزینه چند انتخابی ${grades[randomNumber]}`,
      });
    }

    i++;
  }
  return defaultValues;
};

const fakeData = [
  {
    id: '1',
    title: ' این یک نام  طولانی برای تست است. که اینجا نوشته شده است.',
    programType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '2',
    title: 'نام دوم',
    programType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '3',
    title: 'نام سوم',
    programType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '4',
    title: 'نام چهارم',
    programType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '5',
    title: 'نام پنجم',
    programType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '6',
    title: 'نام ششم',
    programType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '7',
    title: 'نام هفتم',
    programType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '8',
    title: 'نام هشتم',
    programType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '9',
    title: 'نام نهم',
    programType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
];

export default fakeData;
