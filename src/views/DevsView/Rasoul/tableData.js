const getRecordDate = () => {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()} - ${date.toLocaleDateString(
    'fa'
  )}`;
};

const grades = ['اول', 'دوم', 'سوم', 'چهارم', 'پنجم'];
const date = new Date();

const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();

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
    docType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    revisionDate: {
      date: `${year}/${month}/${day}`,
    },
    docNumber: '123456',
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    microsoftFile: {
      fileURL: '/data/API List for Rasoul.pdf',
      fileTitle: 'نام اول فایل طولانی',
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '2',
    title: '',
    docType: {
      options: singleOptions,
      defaultValues: null,
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    revisionDate: {
      date: null,
    },
    docNumber: '123456',
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    microsoftFile: {
      fileURL: '/data/API List for Rasoul.pdf',
      fileTitle: 'نام دوم فایل طولانی',
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '3',
    title: 'نام سوم',
    docType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    revisionDate: {
      date: `${year}/${month}/${day}`,
    },
    docNumber: '',
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    microsoftFile: {
      fileURL: '/data/API List for Rasoul.pdf',
      fileTitle: 'نام سوم فایل طولانی',
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '4',
    title: 'نام چهارم',
    docType: {
      options: singleOptions,
      defaultValues: null,
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    revisionDate: {
      date: `${year}/${month}/${day}`,
    },
    docNumber: '123456',
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    microsoftFile: {
      fileURL: '/data/API List for Rasoul.pdf',
      fileTitle: 'نام چهارم فایل طولانی',
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '5',
    title: 'نام پنجم',
    docType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: null,
    },
    revisionDate: {
      date: `${year}/${month}/${day}`,
    },
    docNumber: '123456',
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    microsoftFile: {
      fileURL: '/data/API List for Rasoul.pdf',
      fileTitle: 'نام پنجم فایل طولانی',
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '6',
    title: 'نام ششم',
    docType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    revisionDate: {
      date: null,
    },
    docNumber: '',
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    microsoftFile: {
      fileURL: '/data/API List for Rasoul.pdf',
      fileTitle: 'نام ششم فایل طولانی',
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '7',
    title: 'نام هفتم',
    docType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    revisionDate: {
      date: `${year}/${month}/${day}`,
    },
    docNumber: '123456',
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    microsoftFile: {
      fileURL: '/data/API List for Rasoul.pdf',
      fileTitle: 'نام هفتم فایل طولانی',
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '8',
    title: 'نام هشتم',
    docType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    revisionDate: {
      date: `${year}/${month}/${day}`,
    },
    docNumber: '123456',
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    microsoftFile: {
      fileURL: '/data/API List for Rasoul.pdf',
      fileTitle: ' نام هشتم فایل طولانی نام هشتم فایل طولانی',
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
  {
    id: '9',
    title: 'نام نهم',
    docType: {
      options: singleOptions,
      defaultValues: getDeafultValues(),
    },
    relatedIndustry: {
      options: multiOptions,
      defaultValues: getDeafultValues(2),
    },
    revisionDate: {
      date: `${year}/${month}/${day}`,
    },
    docNumber: '',
    place: {
      options: binaryOptions,
      defaultValues: getDeafultValues(0),
    },
    microsoftFile: {
      fileURL: '/data/API List for Rasoul.pdf',
      fileTitle: 'نام نهم فایل طولانی',
    },
    recordInfo: {
      recordDate: getRecordDate(),
      userImageURL: '',
    },
  },
];

export default fakeData;
