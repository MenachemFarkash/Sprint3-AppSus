import { utilService } from '../services/util.service.js'

const { useEffect } = React

export function About() {
    useEffect(() => {
        utilService.setFavicon('assets/icons/about.icon.png')
    }, [])

    return <section className="container about">
        <h1>About Page</h1>
    </section>
}
