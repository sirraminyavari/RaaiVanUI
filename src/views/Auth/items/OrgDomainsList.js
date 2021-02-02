import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getDomains from 'store/actions/auth/domainsAction';

const OrgDomainsList = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  useEffect(() => {
    dispatch(getDomains());
  }, []);

  const [domains, setDomains] = useState([]);

  const { RVAPI } = window;

  // RVAPI.GetDomains({
  //     ParseResults: true,
  //     ResponseHandler: function (r) {
  //         for (var i = 0, lnt = (r.Domains || []).length; i < lnt; ++i) {
  //             r.Domains[i].Value = decode(r.Domains[i].Value);
  //             r.Domains[i].Text = decode(r.Domains[i].Text);
  //         }

  //         setDomains(r.Domains)
  //     }
  // });

  return <>{domains.length > 0 && <div></div>}</>;
};
export default OrgDomainsList;
