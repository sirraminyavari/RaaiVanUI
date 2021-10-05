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
    id: '78b4bc15-3b91-4b5c-b76c-74489c07e9ed',
    'b28df794-fa2b-c335-a19c-4f9c9e2f93ac': '',
    'be2d3bf4-d5d6-df65-347f-1c7f20a11589': 'سبیشیبشسی',

    // docType: {
    //   options: singleOptions,
    //   defaultValues: getDeafultValues(),
    // },
    // relatedIndustry: {
    //   options: multiOptions,
    //   defaultValues: getDeafultValues(2),
    // },
    // revisionDate: {
    //   date: `${year}/${month}/${day}`,
    // },
    // docNumber: '123456',
    // place: {
    //   options: binaryOptions,
    //   defaultValues: getDeafultValues(0),
    // },
    // microsoftFile: {
    //   fileURL: '/data/API List for Rasoul.pdf',
    //   fileTitle: 'نام اول فایل طولانی',
    // },
    // topic: {
    //   fileURL: '/data/API List for Rasoul.pdf',
    //   fileTitle: 'نام اول فایل طولانی',
    // },
    // user: {
    //   fileURL: '/data/API List for Rasoul.pdf',
    //   fileTitle: 'نام اول فایل طولانی',
    // },
    // recordInfo: {
    //   recordDate: getRecordDate(),
    //   userImageURL: '',
    // },
  },
  {
    id: '408394df-ba76-411e-8e9c-8dc5ae26e9d0',
    'b28df794-fa2b-c335-a19c-4f9c9e2f93ac':
      'این یک پاراگراف است که البته فعلا امکان ویرایش آن فراهم نشده است.امیدوارم که در آینده نزدیک امکان ویرایش پاراگراف نیز فراهم شود.',
    'be2d3bf4-d5d6-df65-347f-1c7f20a11589': 'یک متن کوتاه',
  },
];

export default fakeData;
