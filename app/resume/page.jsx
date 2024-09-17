'use client';

import { FaJs, FaNodeJs } from 'react-icons/fa';

import {
  SiCypress,
  SiPlaywright,
  SiTypescript,
  SiPostman,
  SiGithubactions,
} from 'react-icons/si';

//about data
const about = {
  title: 'About Me',
  description:
    'Let’s connect! I’m passionate about test automation and always eager to discuss innovative solutions and new opportunities.',
  info: [
    { fieldName: 'Name', fieldValue: 'Vicente Ruiz' },
    { fieldName: 'Phone', fieldValue: '(+34) 636 447 XXX' },
    { fieldName: 'Experience', fieldValue: '11+ Years' },
    { fieldName: 'Nationality', fieldValue: 'Spanish' },
    { fieldName: 'Languages', fieldValue: 'English, Spanish, Catalan' },
  ],
};

//experience data
const experience = {
  icon: '/assets/resume/badge.svg',
  title: 'My experience',
  description:
    'I have over 11 years of experience in QA roles, ranging from test definition to test automation implementation. I also have experience leading teams and mentoring junior qa engineers.',
  items: [
    {
      company: 'wefox',
      position: 'Engineering Lead',
      duration: '04/2022 - 07/2024',
    },
    {
      company: 'wefox',
      position: 'Software Development Engineer in Test',
      duration: '08/2020 - 03/2022',
    },
    {
      company: 'wefox',
      position: 'QA Automation Engineer',
      duration: '01/2020 - 08/2020',
    },
    {
      company: 'Glownet',
      position: 'Quality Assurance Lead',
      duration: '11/2017 - 01/2020',
    },
    {
      company: 'Glownet',
      position: 'Quality Assurance Engineer',
      duration: '11/2016 - 11/2017',
    },
    {
      company: 'GFT',
      position: 'Junior QA Engineer',
      duration: '03/2013 - 01/2016',
    },
    {
      company: 'T-Systems',
      position: 'Software Development Intern',
      duration: '02/2012 - 07/2012',
    },
  ],
};

//education data
const education = {
  icon: '/assets/resume/badge.svg',
  title: 'My education',
  description:
    'I studied Computer Software Engineering at my hometown university. I also participated in the European Project Semester at Copenhagen University College of Engineering, a team-based program with students from around the world.',
  items: [
    {
      institution: 'Polytechnic University of Catalonia',
      degree: 'Computer Software Engineering',
      duration: '2006 - 2013',
    },
    {
      institution: 'Copenhagen University College of Engineering',
      degree: 'European Project Semester',
      duration: '2011',
    },
  ],
};

//skills data
const skills = {
  title: 'My skills',
  description:
    'I specialize in Cypress and Playwright for testing. Familiar with Postman and skilled in using GitHub Actions for CI/CD pipelines.',
  skillsList: [
    { icon: <SiCypress />, name: 'Cypress' },
    { icon: <SiPlaywright />, name: 'Playwright' },
    { icon: <FaJs />, name: 'javascript' },
    { icon: <SiTypescript />, name: 'Typescript' },
    { icon: <FaNodeJs />, name: 'node.js' },
    { icon: <SiPostman />, name: 'Postman' },
    { icon: <SiGithubactions />, name: 'Github Actions' },
  ],
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

const Resume = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: 'easeIn' },
      }}
      className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0"
    >
      <div className="container mx-auto">
        <Tabs
          defaultValue="experience"
          className="flex flex-col xl:flex-row gap-[60px]"
        >
          <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="about">About me</TabsTrigger>
          </TabsList>

          {/*content*/}
          <div className="min-h-[70vh] w-full">
            {/*experience*/}
            <TabsContent value="experience" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{experience.title}</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  {experience.description}
                </p>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {experience.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                        >
                          <span className="text-accent">{item.duration}</span>
                          <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
                            {item.position}
                          </h3>
                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                            <p className="text-white/60">{item.company}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>
            {/*education*/}
            <TabsContent value="education" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{education.title}</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  {education.description}
                </p>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {education.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                        >
                          <span className="text-accent">{item.duration}</span>
                          <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">
                            {item.degree}
                          </h3>
                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>

                            <p className="text-white/60">{item.institution}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>
            {/*skills*/}
            <TabsContent value="skills" className="w-full h-full">
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                  <h3 className="text-4xl font-bold">{skills.title}</h3>
                  <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                    {skills.description}
                  </p>
                </div>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {skills.skillsList.map((skill, index) => {
                    return (
                      <li key={index}>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="w-full h-[150px] bg-[#232329] rounded-xl flex justify-center items-center group">
                              <div className="text-6xl group-hover:text-accent transition-all duration-300">
                                {skill.icon}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="capitalize">{skill.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </TabsContent>
            {/*about*/}
            <TabsContent
              value="about"
              className="w-full text-center xl:text-left"
            >
              <div className="flex flex-col gap-[30px]">
                <h3 className="text-4xl font-bold">{about.title} </h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  {about.description}
                </p>
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                  {about.info.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="flex items-center justify-center xl:justify-start gap-4"
                      >
                        <span className="text-white/60">{item.fieldName}</span>
                        <span className="text-xl">{item.fieldValue}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Resume;
