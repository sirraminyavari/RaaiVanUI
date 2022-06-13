import RVTree from 'components/Tree/RVTree/RVTree';

const TemplateMembersSettings = () => {
  return (
    <>
      <div>members</div>
      <RVTree>
        {(state) => {
          return <div>{state}</div>;
        }}
      </RVTree>
    </>
  );
};
export default TemplateMembersSettings;
