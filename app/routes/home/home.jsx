import UddeshyyaTexture2Large from '~/assets/Uddeshyya-list.jpeg';
import UddeshyyaTexture2Placeholder from '~/assets/Uddeshyya-placeholder.jpg';
import UddeshyyaTexture2 from '~/assets/Uddeshyya-list.jpeg';
import UddeshyyaTextureLarge from '~/assets/Uddeshyya-login.jpeg';
import UddeshyyaTexturePlaceholder from '~/assets/Uddeshyya-login-placeholder.jpg';
import UddeshyyaTexture from '~/assets/Uddeshyya-login.jpeg';
import EcellWebLarge from '~/assets/ecellweb.png';
import EcellWebPlaceholder from '~/assets/ecellweb.png';
import EcellWeb from '~/assets/ecellweb.png';
import MarketWatchLarge from '~/assets/MarketWatch.png';
import MarketWatchPlaceholder from '~/assets/spr-lesson-builder-dark-placeholder.jpg';
import MarketWatch from '~/assets/MarketWatch.png';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import styles from './home.module.css';

// Prefetch draco decoader wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    title: 'Designer + Developer',
    description: `Design portfolio of ${config.name} — a product designer working on web & mobile apps with a focus on motion, experience design, and accessibility.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Market Watch"
        description="Building a real-time stock trading practice platform for investors."
        buttonText="View project"
        //buttonLink="/projects/smart-sparrow"
        buttonLink="https://market-watch-c162a.web.app/#/"
        model={{
          type: 'laptop',
          alt: 'Smart Sparrow lesson builder',
          textures: [
            {
              srcSet: `${MarketWatch} 1280w, ${MarketWatchLarge} 2560w`,
              placeholder: MarketWatchPlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="Uddeshhya"
        description="Designing a streamlined app for efficient internal team management."
        buttonText="View Project"
        //buttonLink="/projects/smart-sparrow"
        model={{
          type: 'phone',
          alt: 'App login screen',
          textures: [
            {
              srcSet: `${UddeshyyaTexture} 375w, ${UddeshyyaTextureLarge} 750w`,
              placeholder: UddeshyyaTexturePlaceholder,
            },
            {
              srcSet: `${UddeshyyaTexture2} 375w, ${UddeshyyaTexture2Large} 750w`,
              placeholder: UddeshyyaTexture2Placeholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="E-Cell Web"
        description="KIET E-Cell is a student body of KIET, formed in 2014 with the aim to promote an entrepreneurial culture among the young minds of today's generation"
        buttonText="View project"
        buttonLink="https://e-cell.in/"
        model={{
          type: 'laptop',
          alt: 'Annotating a biomedical image in the Slice app',
          textures: [
            {
              srcSet: `${EcellWeb} 800w, ${EcellWebLarge} 1920w`,
              placeholder: EcellWebPlaceholder,
            },
          ],
        }}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
