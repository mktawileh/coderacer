export default {
  became_gm: (name) => {
    return (
      <>
        You became one of the best 😎 Congratulations <b>{name}</b> you are now
        a <span className="gm-lvl">Grandmastser</span> Racer
      </>
    );
  },
  became_mst: (name) => {
    return (
      <>
        Congratulations!! <b>{name}</b> 😀 you are now a{" "}
        <span className="mst-lvl">Master</span> Racer!
      </>
    );
  },
  became_pro: (name) => {
    return (
      <>
        What a performance <b>{name}</b> 😯 you are now a{" "}
        <span className="pro-lvl">Pro</span> Racer
      </>
    );
  },
  became_ex: (name) => {
    return (
      <>
        What a remarkable skill that you have <b>{name}</b> 😏 you became an{" "}
        <span className="ex-lvl">Expert</span> Racer
      </>
    );
  },
  became_pup: (name) => {
    return (
      <>
        Every Grandmaster once was a pupil 😄 keep up the good work{" "}
        <b>{name}</b> you are now a <span className="pup-lvl">Pupil</span> Racer
      </>
    );
  },
};
