import { utilService } from '../services/util.service.js'

const { useEffect } = React

const TECH_STACK = [
    { name: 'React', icon: 'fa-brands fa-react' },
    { name: 'React Router', icon: 'fa-solid fa-route' },
    { name: 'JavaScript', icon: 'fa-brands fa-js' },
    { name: 'CSS3', icon: 'fa-brands fa-css3-alt' },
    { name: 'ESLint', icon: 'fa-solid fa-code-compare' },
]

const TEAM = [
    {
        fullname: 'Ran Ferdinaro',
        photo: 'assets/img/Ran.png',
        title: 'Full-Stack Engineer | Tricentis',
        bio: '28 years old.\n Driven by finding edge cases and solving the impossible.',
        github: 'https://github.com/r-ferdinaro',
        linkedin: 'http://linkedin.com/in/ran-ferdinaro',
    },
    {
        fullname: 'Menachem Farkash',
        photo: 'assets/img/Menachem.jpeg',
        title: 'Full-Stack Engineer',
        bio: 'Building AppSus\' Notes app.',
        github: 'https://github.com/MenachemFarkash',
        linkedin: 'https://www.linkedin.com/in/menachem-farkash-939781256/',
    },
]

export function About() {
    useEffect(() => {
        utilService.setFavicon('assets/icons/about.icon.png')
    }, [])

    return (
        <section className="container about">
            <div className="about-intro">
                <h1>AppSus</h1>
                <p>
                    AppSus is a suite of Google-inspired web apps built as one shell: {<br></br>}
                    1. Gmail-style <strong>Mail</strong> client {<br></br>}
                    2. Google Keep-style{' '} <strong>Notes</strong> app {<br></br>}
                    Both apps are sharing a single header, folder navigation, and filter bar.
                </p>
            </div>

            <div className="about-stack">
                <h2>Tech Stack</h2>
                <ul className="stack-list">
                    {TECH_STACK.map(tech => (
                        <li key={tech.name} className="stack-item">
                            <i className={tech.icon}></i>
                            <span>{tech.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="about-team">
                <h2>Team</h2>
                <div className="team-list">
                    {TEAM.map(member => (
                        <div className="team-card" key={member.fullname}>
                            <img className="team-avatar" src={member.photo} alt={member.fullname} />
                            
                            <div className="team-info">
                                <h3>{member.fullname}</h3>
                                <p className="team-title">{member.title}</p>
                                <p>{member.bio}</p>
                                <div className="team-links">
                                    <a href={member.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                                        <i className="fa-brands fa-github"></i>
                                    </a>
                                    <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                        <i className="fa-brands fa-linkedin"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
