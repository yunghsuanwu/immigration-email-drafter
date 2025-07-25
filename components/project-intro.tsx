import { TriangleAlert } from "lucide-react"

export function RuleChange() {
  return (
    <section id="immigration-rule-change" className="max-w-2xl mx-auto py-8 md:py-12 px-2 mb-12 text-left">
      <div>
        <h1 className="text-3xl font-bold mb-10 text-center">What are the 2025 Immigration Rule Changes?</h1>
        <p className="mb-10 text-center">
        <strong>Last updated:</strong> {new Date().toLocaleDateString('en-GB', { 
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
        </p>

        <p className="font-bold mb-4">
          On 22 July 2025, the UK government implements{" "}
            <a
          href="https://www.gov.uk/government/news/major-immigration-reforms-delivered-to-restore-order-and-control"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          four major changes
        </a>{" "}
          to the immigration rules:
        </p>
        <ul className="list-disc list-outside space-y-2 mb-4 ml-4 pl-4">
          <li>The skill threshold for Skilled Worker visas is now raised, and more than 100 eligible occupations are now removed;</li>
          <li>The social care worker visa route to overseas recruitment is now closed;</li>
          <li>
            There is only time-limited access below degree level through a targeted immigration salary list 
            and temporary shortage list, for critical roles only, with strict requirements for sectors to 
            grow domestic skills;
          </li>
          <li>The Commission the Migration Advisory Committee (MAC) is to conduct a review of the temporary shortage list including occupations, salaries and benefits.</li>
        </ul>
        <p className="mb-4">
          Among these changes, we particularly encourage those on or thinking of getting a Skilled Worker visa to check out the updated official government page of{" "}
          <a
          href="https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          >
            Skilled Occupation List
          </a>.
        </p>
        <p className="mb-4">
          This page lists all eligible occupations for Skilled Worker visas and their going rate by job title and Standard Occupational Code (SOC). We recommend checking this list along with the{" "}
          <a
          href="https://www.gov.uk/government/publications/skilled-worker-visa-eligible-occupations/skilled-worker-visa-eligible-occupations-and-codes"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          >
            official CASCOT tool
          </a>{" "}
          to determine your job code.
        </p>
        <p className="mb-6">
          <strong>Importantly, these changes may affect you differently</strong> depending on whether you are currently in the UK on a visa route, if you&apos;re planning to switch visa routes, or if you&apos;re new to a visa route. When in doubt, we recommend seeking professional advice from a qualified immigration lawyer or advisor.
        </p>
        <span className="flex items-start gap-2 mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <TriangleAlert className="w-8 h-5" />
          <p>We are <strong>not licensed advisors</strong> who could provide personalised advice on immigration issues; we only compile information from trusted sources.</p>
        </span>
        <p className="mb-4">
          We&apos;re currently working with experts to provide a detailed summary on what these changes may mean for different stakeholders, including visa holders, those with indefinite leave to remain/settled status, employers, and beyond. 
        </p>
        <p className="mb-4">
          In the meantime, we encourage you to check out some resources that other migrant advisory bodies, rights groups, and stakeholder specific organisations have already compiled:
        </p>
        <ul className="list-disc list-outside space-y-2 mb-4 ml-4 pl-4">
          <li>Citizens Advice: <a 
          href="https://www.citizensadvice.org.uk/immigration/how-changes-to-immigration-rules-might-affect-you/" 
          target="_blank"
          rel="noopener noreferrer"
          className="underline">
            How changes to immigration rules might affect you
          </a>
          </li>
          <li> Migrants' Rights Network: <a
          href="https://migrantsrights.org.uk/2025/05/14/immigration-white-paper-summary/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          >
            What is the new Immigration White Paper proposing?
          </a>
          </li>
          <li>Migrants' Rights Network: <a
          href="https://migrantsrights.org.uk/2025/07/24/immigration-white-paper-skilled-visa-salary-changes-come-into-force/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          >
            Immigration White Paper Skilled Visa Salary Changes Come Into Force
          </a>
          </li>
          <li>NHS Employers: <a 
          href="https://www.nhsemployers.org/articles/immigration-rule-changes-july-2025" 
          target="_blank"
          rel="noopener noreferrer"
          className="underline">
            Immigration rule changes - July 2025
          </a>
          </li>
          <li>Freemovement articles – The <a 
          href="https://freemovement.org.uk/all-posts/" 
          target="_blank"
          rel="noopener noreferrer"
          className="underline">
            blog posts
          </a>{" "}
          tackle multiple areas of immigration law, including the recent changes. The following articles are particularly relevant to the 2025 changes (older articles may be paywalled):
            <ul className="list-disc list-outside space-y-2 mb-4 ml-4 pl-4">
              <li>
                <a 
                href="https://freemovement.org.uk/what-does-the-immigration-white-paper-say-about-workers-and-students/#Another_new_shortage_occupation_list"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                >
                  What does the immigration white paper say about workers and students?
                </a>
              </li>
              <li>
                <a
                href="https://freemovement.org.uk/immigration-white-paper-the-case-for-optimism-and-what-sponsors-should-do/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                >
                  Immigration white paper – the case for optimism and what sponsors should do
                </a>
              </li>
              <li>
                <a
                href="https://freemovement.org.uk/immigration-white-paper-impacts-on-the-higher-education-sector-and-international-students/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                >
                  Immigration white paper impacts on the Higher Education sector and international students
                </a>
              </li>
              <li>
                <a
                href="https://freemovement.org.uk/how-much-does-it-cost-to-sponsor-someone-for-a-uk-work-visa/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                >
                  How much does it cost to sponsor someone for a UK work visa?
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </section>
  )
}

export function WhyWriteToYourMP() {
  return (
    <section className="py-6 md:py-10 text-center px-4 mb-8">
      <p className="font-bold text-muted-foreground max-w-2xl mx-auto mt-4">
        With the immigration rule change imminent, this tool helps you draft a personalized, professional email to
        your Member of Parliament about your concerns regarding the immigration white paper.
        <br />
        Explain further why write to your MP.
      </p>
    </section>
  )
}