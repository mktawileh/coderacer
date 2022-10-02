import Page from "../view/Page";
import Tooltip from "../view/components/Tooltip";

export default function () {
  return (
    <Page>
      <div className="wrapper px-sm-5">
        <div className="text-center">
          <b className="h3">
            <span className="purple">Code</span>Racer
          </b>
          <span> version 1.0.0</span>
        </div>
        <div className="sec mt-3">
          <p>
            CodeRacer is the best place for you to improve your typing speed and
            also your programming knowlege. You test your speed while learning
            new algorithms or new technique provided by other programmers, you
            may also{" "}
            <Tooltip
              text={
                <>
                  You can contact us on:
                  <br />
                  mohamedtawileh@gmail.com
                </>
              }
            >
              <span className="purple">
                <b>
                  <u>contribute</u>
                </b>
              </span>
            </Tooltip>{" "}
            your coding experience and share your techniques of the programming
            language you're good at.
            <br />
            CodeRacer is a place for programmers to hangout and share some
            coding sources while competing with one another.
            <br />
            It's also a place that will make your code look better for the human
            eyes, and will tech you the proper and the prefered whay to write
            code in the programming community.
            <br />
          </p>
        </div>
        <div className="sec">
          <h5>
            <b>Here some of the frequently asked questions (FAQ):</b>
          </h5>
          <p>
            <ul>
              <li>
                <b>What is CWPM?</b>
                <p>
                  cwpm is a shortcut for "Code Word Per Minute", while there is
                  a term or unit called "Word Per Minute" known as WPM which
                  represent the unit of speed that the racer performed during
                  the race or in other speak, the amount of words typed during a
                  minute.. and this unit equals to (3 ~ 4 character per minute),
                  but in the programming world, most of the words consist of
                  only one or two characters ("=", "+", "[", "int", ";", ..etc)
                  and for that, WPM became a little unaccurate for calculating
                  the speed of the user, and that's when CWPM became useful,
                  it's equal to (2 ~ 3 characters per minute).
                </p>
              </li>
              <li>
                <b>Why some usernames have different colour from other?</b>
                <p>
                  You might heard of{" "}
                  <a href="https://codeforces.com">Codeforces</a>, a website
                  which host competitive programming contests, and it have a
                  colour distribution for rates and title, well CodeRacer uses
                  the same thing here to encourge the competitve spirit of
                  programmers.
                  <br />
                  Here is the colours and title distribution:
                  <ul>
                    <li>
                      <span className="gm-lvl">Grandmaster Racer</span>, Speed:
                      150+ cwpm
                    </li>

                    <li>
                      <span className="mst-lvl">Master Racer</span>, Speed: (109
                      - 149) cwpm
                    </li>

                    <li>
                      <span className="ex-lvl">Expert Racer</span>, Speed: (83 -
                      108) cwpm
                    </li>

                    <li>
                      <span className="pro-lvl">Pro Racer</span>, Speed: (61 -
                      82) cwpm
                    </li>

                    <li>
                      <span className="pup-lvl">Pupil Racer </span>, Speed: (40
                      - 60) cwpm
                    </li>

                    <li>
                      <span className="nb-lvl">Newbie Racer</span>, Speed: (0 -
                      39) cwpm
                    </li>
                  </ul>
                </p>
              </li>
              <li>
                <b>How CodeRacer determine the title of a user:</b>
                <p>
                  Any user current title doesn't depend on anything else but the
                  avgerage speed of the last 10 races they did. their best
                  achievement and their best title, will be shown in thier
                  profile publicly.
                </p>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </Page>
  );
}
