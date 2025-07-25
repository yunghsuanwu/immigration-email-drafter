export function PrivacyNotice() {
  return (
    <section
      id="privacy-notice"
      className="max-w-2xl mx-auto py-8 md:py-12 px-4 mb-12 text-left"
    >
      <h1 className="text-3xl font-bold mb-10 text-center">Privacy Notice for Re:Immigration</h1>
      
      <p className="mb-10 text-center">
        <strong>Last updated:</strong> {new Date().toLocaleDateString('en-GB', { 
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </p>
      
      <h2 className="text-2xl font-semibold mt-10 mb-6">Who we are</h2>
      <p className="mb-4">
        <a
          href="https://www.notastranger.org/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Not A Stranger
        </a>{' '}
        (notastranger.org) is a migrant-led initiative by young civic technologists building their lives in the UK. It was created in response to the government&apos;s{' '}
        <a
          href="https://www.gov.uk/government/publications/restoring-control-over-the-immigration-system-white-paper"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          2025 white paper on immigration
        </a>
        {', '}which includes sweeping changes to the path to citizenship and further restrictions on migrants&apos; rights. In the face of growing anti-immigrant rhetoric, we&apos;re developing digital tools that empower migrants not only to be heard -- but to shape the policies that affect our communities.
      </p>
      <p className="mb-8">
        <strong>Contact us by email:</strong> contact[at]notastranger[dot]org
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-6">What is Re:Immigration?</h2>
      <p className="mb-4">
        Re:Immigration is a large language model-based email drafting tool developed under this initiative. It helps users convey to policymakers how immigration rule changes would impact them, and will be used to catalyse responses at scale to the public whitepaper consultation expected in the coming months.
      </p>
      <p className="mb-8">
        <strong>Important:</strong> This tool does not help you send the email to your Member of Parliament (MP); you must manually copy and paste the generated content into your personal email tool and send it yourself. We highly recommend{' '}
        <a
          href="https://www.writetothem.com/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          WriteToThem
        </a>{' '}
        created by MySociety as a simple service for contacting your MP directly. All your final email correspondence with your MP remains invisible to us.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-6">What personal information we collect and why</h2>
      <h3 className="text-xl font-semibold mt-8 mb-4">Information we collect by default</h3>
      <p className="mb-2">
        When you use the &quot;Generate Email to MP&quot; function, we collect and store the following information:
      </p>
      <ul className="list-disc list-outside mb-4 ml-4 pl-4">
        <li>Your postal code</li>
        <li>Your residency status (e.g., UK national, visa holder, other statuses)</li>
        <li>Your visa type (if you&apos;re a visa holder)</li>
        <li>Your explanation of other statuses (if applicable)</li>
        <li>Your reason for writing the email</li>
      </ul>
      <p className="mb-4">
        <strong>Why we collect this:</strong> We use this information to understand the geographical coverage of our tool&apos;s use and engagement statistics of user groups by residency status.
      </p>
      
      <p className="mb-4">
        <strong>Legal basis:</strong> Legitimate interests (GDPR Article 6(1)(f)) - we have a legitimate interest in understanding how our tool is being used to improve civic engagement and support immigration policy research.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4">Optional research data (with your consent)</h3>
      <p className="mb-2">If you opt in to help with research, we will also collect:</p>
      <ul className="list-disc list-outside mb-4 ml-4 pl-4">
        <li>How long you&apos;ve been in the UK</li>
        <li>Your yearly income (in brackets)</li>
        <li>Your profession/job title</li>
        <li>Your Standard Occupational Code (SOC)</li>
        <li>Your annual tax contribution (estimated)</li>
        <li>Your company&apos;s industry and size</li>
        <li>Your company&apos;s yearly revenue (in brackets)</li>
        <li>Your company&apos;s current and envisaged number of employees on visa</li>
        <li>Your immigration concerns</li>
      </ul>
      <p className="mb-4">
        <strong>Why we collect this:</strong> We use this information to create aggregate statistics about those impacted by immigration rule changes and to support ongoing immigration research within the remit of Not A Stranger.
      </p>
      <p className="mb-4">
        <strong>Legal basis:</strong> Consent (GDPR Article 6(1)(a)) - you can withdraw your consent at any time by contacting us.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4">Optional email updates (with your consent)</h3>
      <p className="mb-4">If you opt in to save your email address, we will collect your email address.</p>
      <p className="mb-4">
        <strong>Why we collect this:</strong> To contact you with updates about Re:Immigration, the Not A Stranger initiative, and relevant campaigns.
      </p>
      <p className="mb-8">
        <strong>Legal basis:</strong> Consent (GDPR Article 6(1)(a)) - you can withdraw your consent at any time by contacting us.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-6">What we don&apos;t collect</h2>
      <p className="mb-2">We do not store:</p>
      <ul className="list-disc list-outside mb-4 ml-4 pl-4">
        <li>Your name</li>
        <li>Your generated email draft</li>
        <li>Your edited email draft</li>
      </ul>
      <p className="mb-8">
        <strong>Note:</strong> If you mention your name or other personally identifiable information in free-text boxes, we will perform standard pseudonymisation as part of our data processing.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-6">How we store and protect your data</h2>
      <p className="mb-4">Your data is stored in a database hosted on Supabase, an open-source Postgres development platform, and we process your data in the EU.</p>
      <p className="mb-8">When you use &quot;Draft another email,&quot; the form&apos;s data resets to blank, but previously submitted data remains in our database according to the retention periods below.</p>

      <h2 className="text-2xl font-semibold mt-10 mb-6">How long we keep your data</h2>
      <ul className="list-disc list-outside mb-4 ml-4 pl-4">
        <li><strong>Default collected data:</strong> Retained for 1 year after collection</li>
        <li><strong>Research data:</strong> Retained for 1 year or until you withdraw consent</li>
        <li><strong>Email addresses:</strong> Retained until you unsubscribe or withdraw consent</li>
        <li><strong>Pseudonymised research data:</strong> May be retained indefinitely for research purposes</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-6">Your rights under GDPR</h2>
      <p className="mb-2">You have the right to:</p>
      <ul className="list-disc list-outside mb-4 ml-4 pl-4">
        <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
        <li><strong>Rectification:</strong> Ask us to correct inaccurate personal data</li>
        <li><strong>Erasure:</strong> Request deletion of your personal data (subject to certain limitations)</li>
        <li><strong>Restrict processing:</strong> Ask us to limit how we use your data</li>
        <li><strong>Data portability:</strong> Request your data in a portable format</li>
        <li><strong>Object:</strong> Object to our processing of your personal data</li>
        <li><strong>Withdraw consent:</strong> For data processed based on consent, you can withdraw it at any time</li>
      </ul>
      <p className="mb-8">
        To exercise any of these rights, please contact us at the contact details above. We will respond within two weeks of receiving your request.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-6">Complaints</h2>
      <p className="mb-8">
        If you believe we have mishandled your personal data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO). You can{' '}
        <a
          href="https://ico.org.uk/make-a-complaint/data-protection-complaints/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          report a concern here
        </a>
        , but please contact us first so we can try to resolve the issue.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-6">Third-party services</h2>
      <p className="mb-8"><strong>Supabase:</strong> We use Supabase for data storage. Their privacy policy can be found on{' '}
        <a
        href="https://supabase.com/privacy"
        className="underline"
        target="_blank"
        rel="noopener noreferrer"
        >
        their website
        </a>.</p>

      <h2 className="text-2xl font-semibold mt-10 mb-6">Changes to this privacy notice</h2>
      <p className="mb-8">
        We may update this privacy notice from time to time. Any significant changes will be communicated through email notifications to users who consented to us saving their emails and/or prominent notice on our website.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-10 mb-6">Contact us</h2>
      <p>
        If you have any questions about this privacy notice or how we handle your personal data, please contact us at: <strong>contact[at]notastranger[dot]org</strong>
      </p>
    </section>
  );
}