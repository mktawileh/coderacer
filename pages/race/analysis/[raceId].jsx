import { useState, useEffect } from "react";
import Page from "../../../view/Page";
import AnalysisRace from "../../../view/AnalysisRace";
import RaceInfo from "../../../view/RaceInfo";
import CompareCode from "../../../view/CompareCode";
import RacerCard from "../../../view/RacerCard";

export async function getServerSideProps({ req, res }) {
  return {
    props: {
      data: JSON.parse(req.pageProps ? req.pageProps.data || "{}" : "{}"),
    },
  };
}

export default function ({ userState, titleState, data }) {
  const [user, setUser] = userState;
  const [title, setTitle] = titleState;

  useEffect(() => {
    setTitle("Analysis race");
  }, []);
  return (
    <Page>
      <RacerCard user={data.owner} />
      <RaceInfo show code={data.code} />
      <CompareCode
        code={data.code.value}
        userCode={data.value}
        owner={data.owner.username == user.username}
      />
      <AnalysisRace
        show
        {...data}
        owner={data.owner.username == user.username}
        noRacerCode
      />
    </Page>
  );
}
