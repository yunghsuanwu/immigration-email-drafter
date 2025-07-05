export function CallToAction() {
  return (
    <section id="call-to-action" className="py-6 md:py-10 text-center px-4 mb-8">
      <h2 className="text-3xl md:text-5xl font-bold mb-2">Re:Immigration</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
        With the immigration rule change imminent (
          <a
           href="https://notastranger.org/contactyourmp/about"
           target="_blank"
           rel="noopener noreferrer"
           className="underline"
          >
           read what's changing
          </a>
          ), we are mobilizing those who will be affected or know someone that will to take a simple yet signicant action: Write to your Member of Parliament.
      </p>
      <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
        The immigration rule change is subject to your MP's approval via voting. Before they cast their vote, tell them your story and show them the impact of the changes.
      </p>
      <p className="font-bold text-muted-foreground max-w-2xl mx-auto mt-4">
        Tell them you are not a stranger. 
      </p>
    </section>
  )
}