import { Suspense } from "react";
import Spinner from "components/Spinner";

const WithSuspense = ({ component: Component }) => {
  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  );
};

export default WithSuspense;