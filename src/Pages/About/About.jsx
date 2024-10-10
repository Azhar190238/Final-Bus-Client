import BasicHeader from "../Shared-file/BasicHeader";
import Welcome from "./Welcome";

const About = () => {
    return (
        <div>
             <BasicHeader heading='About'/>
          <Welcome></Welcome>
        </div>
    );
};

export default About;