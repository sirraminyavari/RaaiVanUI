const getRecordDate = () => {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()} - ${date.toLocaleDateString(
    'fa'
  )}`;
};

const grades = ['اول', 'دوم', 'سوم', 'چهارم', 'پنجم'];

const singleOptions = grades.map((x) => ({
  value: `single-${x}`,
  label: `گزینه تک انتخابی ${x}`,
}));

const multiOptions = grades.map((x) => ({
  value: `multi-${x}`,
  label: `گزینه چند انتخابی ${x}`,
}));

const binaryOptions = [grades[0], grades[1]].map((x) => ({
  value: `binary-${x}`,
  label: `گزینه باینری ${x}`,
}));
const getDeafultValues = (count = 1) => {
  let i = 0;
  let defaultValues = [];
  while (i < count) {
    let randomNumber = Math.floor(Math.random() * 5);
    if (count === 1) {
      //! Single select.
      defaultValues.push({
        value: `single-${grades[randomNumber]}`,
        label: `گزینه تک انتخابی ${grades[randomNumber]}`,
      });
    } else {
      //! Multi select.
      defaultValues.push({
        value: `multi-${grades[randomNumber]}`,
        label: `گزینه چند انتخابی ${grades[randomNumber]}`,
      });
    }

    i++;
  }
  if (count === 0) {
    //! Binary.
    let randomNumber = Math.floor(Math.random() * 2);
    defaultValues.push({
      value: `binary-${grades[randomNumber]}`,
      label: `گزینه باینری ${grades[randomNumber]}`,
    });
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
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
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
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
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
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
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
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
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
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
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
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
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
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
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
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
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
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
];

export default fakeData;
