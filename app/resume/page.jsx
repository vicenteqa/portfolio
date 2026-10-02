'use client';

import { FaJs, FaNodeJs, FaTheaterMasks } from 'react-icons/fa';
// react-icons 5.7 dropped the Simple Icons entries for Playwright and Azure
import { VscAzure } from 'react-icons/vsc';

import {
  SiCypress,
  SiTypescript,
  SiPostman,
  SiGithubactions,
  SiTerraform,
  SiAnsible,
  SiHelm,
} from 'react-icons/si';

import { yearsInQA } from '@/lib/career';

const YEARS = yearsInQA();

//about data
const about = {
  title: 'About Me',
  description:
    'Let’s connect! I’m passionate about test automation and always eager to discuss innovative solutions and new opportunities.',
  info: [
    { fieldName: 'Name', fieldValue: 'Vicente Ruiz' },
    { fieldName: 'Phone', fieldValue: '(+34) 636 447 XXX' },
    { fieldName: 'Experience', fieldValue: `${YEARS}+ Years` },
    { fieldName: 'Nationality', fieldValue: 'Spanish' },
    { fieldName: 'Location', fieldValue: 'Barcelona' },
    { fieldName: 'Languages', fieldValue: 'English, Spanish, Catalan' },
  ],
};

//experience data
const experience = {
  icon: '/assets/resume/badge.svg',
  title: 'My experience',
  description:
    `I have over ${YEARS} years of experience in QA roles, ranging from test definition to test automation implementation. I also have experience leading teams and mentoring junior qa engineers.`,
  items: [
    {
      company: 'SUSE',
      position: 'Software Engineer - QA',
      duration: '12/2024 - Now',
      highlights: [
        'Automate infrastructure provisioning and validation end to end: Terraform, Ansible and GitHub Actions pipelines that stand up Azure environments and verify release candidates across every supported SLES for SAP version.',
        'Own release engineering and CI across the product stack: OBS package sync, Helm chart releases, new OS target enablement and dependency vulnerability remediation.',
        'Turned test reliability from ad-hoc firefighting into an owned system: automated flaky detection across backend, frontend and E2E, with a dashboard, failure evidence and alerting.',
        'Set testing standards for the team: Page Object architecture across the E2E suite and 60% faster execution through parallelization.',
        'Work AI-first, using coding agents for scaffolding, root-cause analysis, large-scale refactors and automating repetitive day-to-day tasks.',
      ],
    },
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
    'I specialize in Playwright and Cypress for testing, and in the workflows that validate package releases: Terraform, Ansible and GitHub Actions deploy Azure VMs, install the stack and run the tests.',
  skillsList: [
    { icon: <SiCypress />, name: 'Cypress' },
    { icon: <FaTheaterMasks />, name: 'Playwright' },
    { icon: <FaJs />, name: 'javascript' },
    { icon: <SiTypescript />, name: 'Typescript' },
    { icon: <FaNodeJs />, name: 'node.js' },
    { icon: <SiPostman />, name: 'Postman' },
    { icon: <SiGithubactions />, name: 'Github Actions' },
    { icon: <SiTerraform />, name: 'Terraform' },
    { icon: <SiAnsible />, name: 'Ansible' },
    { icon: <SiHelm />, name: 'Helm' },
    { icon: <VscAzure />, name: 'Azure' },
  ],
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';

// consecutive roles at the same company are shown under one heading
const groupByCompany = (items) =>
  items.reduce((groups, item) => {
    const last = groups[groups.length - 1];
    if (last && last.company === item.company) last.roles.push(item);
    else groups.push({ company: item.company, roles: [item] });
    return groups;
  }, []);

const isCurrent = (duration) => /now$/i.test(duration);

const tabs = [
  { value: 'experience', file: 'experience.spec', count: experience.items.length },
  { value: 'education', file: 'education.spec', count: education.items.length },
  { value: 'skills', file: 'skills.spec', count: skills.skillsList.length },
  { value: 'about', file: 'about.json', count: about.info.length },
];

const Heading = ({ children, text }) => (
  <div className="mb-8">
    <h2 className="h3 !text-3xl xl:!text-4xl mb-3">{children}</h2>
    <p className="max-w-[640px] text-white/60">{text}</p>
  </div>
);

const Status = ({ running }) =>
  running ? (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent">
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-accent opacity-60 animate-ping" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-accent" />
      </span>
      running
    </span>
  ) : (
    <span className="font-mono text-[11px] uppercase tracking-wider text-success">✓ passed</span>
  );

const Resume = () => {
  return (
    <section className="container mx-auto pb-12">
      <PageHeader label="resume" intro={`${YEARS} years in QA, listed like a test run.`}>
        Track <span className="text-accent">record</span>
      </PageHeader>

      <Tabs
        defaultValue="experience"
        className="flex flex-col xl:flex-row gap-8 xl:gap-14"
      >
        <TabsList
          aria-label="Resume sections"
          className="flex xl:flex-col gap-2 xl:w-[300px] shrink-0 overflow-x-auto xl:overflow-visible xl:sticky xl:top-8 xl:self-start pb-2 xl:pb-0"
        >
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              <span className="flex items-center gap-2">
                <span className="text-white/30 group-data-[state=active]:text-accent">▸</span>
                {t.file}
              </span>
              <span className="font-mono text-[11px] text-white/40">{t.count}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0 flex-1">
          {/* experience */}
          <TabsContent value="experience">
            <Heading text={experience.description}>{experience.title}</Heading>
            <ol className="relative">
              {groupByCompany(experience.items).map((group, gi) => (
                <motion.li
                  key={group.company + gi}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.07, duration: 0.4 }}
                  className="relative pl-9 pb-10 last:pb-0"
                >
                  <span className="absolute left-[7px] top-3 bottom-0 w-px bg-white/10 last:hidden" />
                  <span
                    className={`absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 ${
                      group.roles.some((r) => isCurrent(r.duration))
                        ? 'border-accent bg-accent/30'
                        : 'border-success/70 bg-ink'
                    }`}
                  />
                  <h3 className="font-display text-2xl xl:text-3xl font-bold mb-3">
                    {group.company}
                  </h3>
                  <ul className="space-y-3">
                    {group.roles.map((r) => (
                      <li
                        key={r.position + r.duration}
                        className="group rounded border border-white/10 bg-primary/60 px-5 py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2 hover:border-accent/40 hover:bg-primary transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-lg text-white">{r.position}</p>
                          <p className="font-mono text-xs text-white/50">{r.duration}</p>
                          {r.highlights && (
                            <ul className="mt-4 space-y-2.5 text-[15px] text-white/70">
                              {r.highlights.map((h) => (
                                <li key={h} className="flex gap-3">
                                  <span className="text-accent mt-[0.15em] shrink-0" aria-hidden>
                                    ▸
                                  </span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <Status running={isCurrent(r.duration)} />
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ol>
          </TabsContent>

          {/* education */}
          <TabsContent value="education">
            <Heading text={education.description}>{education.title}</Heading>
            <ul className="grid gap-4 lg:grid-cols-2">
              {education.items.map((item, i) => (
                <motion.li
                  key={item.degree}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="relative overflow-hidden rounded-md border border-white/10 bg-primary/60 p-6 hover:border-accent/40 transition-colors"
                >
                  <span className="absolute -right-3 -top-6 font-display text-[110px] font-extrabold leading-none text-white/[0.04]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-mono text-xs text-accent mb-3">{item.duration}</p>
                  <h3 className="font-display text-xl font-bold mb-2">{item.degree}</h3>
                  <p className="text-white/60">{item.institution}</p>
                </motion.li>
              ))}
            </ul>
          </TabsContent>

          {/* skills */}
          <TabsContent value="skills">
            <Heading text={skills.description}>{skills.title}</Heading>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skills.skillsList.map((skill, i) => (
                <motion.li
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="group relative h-[140px] rounded-md border border-white/10 bg-primary/60 flex flex-col items-center justify-center gap-3 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(41,212,255,0.12)] transition-all duration-300"
                >
                  <span className="absolute top-3 right-4 font-mono text-[10px] text-success opacity-0 group-hover:opacity-100 transition-opacity">
                    ✓ pass
                  </span>
                  <div className="text-5xl text-white/80 group-hover:text-accent transition-colors duration-300">
                    {skill.icon}
                  </div>
                  <p className="font-mono text-xs capitalize text-white/60">{skill.name}</p>
                </motion.li>
              ))}
            </ul>
          </TabsContent>

          {/* about: rendered as the file it pretends to be */}
          <TabsContent value="about">
            <Heading text={about.description}>{about.title}</Heading>
            <pre className="rounded-md border border-white/10 bg-black/30 p-6 font-mono text-sm leading-7 overflow-x-auto">
              <code>
                <span className="text-white/40">{'{'}</span>
                {'\n'}
                {about.info.map((item, i) => (
                  <span key={item.fieldName}>
                    {'  '}
                    <span className="text-accent">"{item.fieldName.toLowerCase()}"</span>
                    <span className="text-white/40">: </span>
                    <span className="text-amber">"{item.fieldValue}"</span>
                    {i < about.info.length - 1 && <span className="text-white/40">,</span>}
                    {'\n'}
                  </span>
                ))}
                <span className="text-white/40">{'}'}</span>
              </code>
            </pre>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
};

export default Resume;
