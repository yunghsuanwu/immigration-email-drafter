
export function PrivacyNotice() {
    return (
        <section id="privacy-notice" className="py-6 md:py-10 text-center px-4 mb-8">
            <h1>Who we are</h1>
            <p><a href="https://www.notastranger.org/">Not A Stranger</a> (notastranger.org) is a migrant-led initiative by young civic technologists building their lives in the UK. It was created in response to the government's 2025 white paper on immigration, which includes sweeping changes to the path to citizenship and further restrictions on migrants' rights. In the face of growing anti-immigrant rhetoric, we're developing digital tools that empower migrants not only to be heard -- but to shape the policies that affect our communities.</p>
            <p><strong>Contact us by email:</strong> contact[at]notastranger[dot]org</p>

            <h1>What is Re:Immigration?</h1>
            <p>Re:Immigration is a large language model-based email drafting tool developed under this initiative. It helps users convey to policy makers how immigration rule changes would impact them, and will be used to catalyse responses at scale to the public whitepaper consultation expected in the coming months.</p>
            <p><strong>Important:</strong> This tool does not help you send the email to your Member of Parliament (MP); you must manually copy and paste the generated content into your personal email tool and send it yourself. We highly recommend <a href="https://www.writetothem.com/">WriteToThem</a> created by MySociety as a simple service for contacting your MP directly. All your final email correspondence with your MP remains invisible to us.</p>

            <h1>What personal information we collect and why</h1>
            <h2>Information we collect by default</h2>
            <p>When you use the "Generate Email to MP" function, we collect and store the following information:</p>
            <h3>Personal data collected:</h3>
            <ul>
                <li>Your postal code</li>
                <li>Your residency status (e.g., UK national, visa holder, other statuses)</li>
                <li>Your visa type (if you're a visa holder)</li>
                <li>Your explanation of other statuses (if applicable)</li>
                <li>Your reason for writing the email</li>
            </ul>
            <h3>Why we collect this:</h3>
            <p>We use this information to understand the geographical coverage of our tool's use and engagement statistics of user groups by residency status.</p>
            <p><strong>Legal basis:</strong> Legitimate interests (GDPR Article 6(1)(f)) - we have a legitimate interest in understanding how our tool is being used to improve civic engagement and support immigration policy research.</p>
            <h2>Optional research data (with your consent)</h2>
            <p>If you opt in to help with research, we will also collect:</p>
            <h3>Additional personal data:</h3>
            <ul>
                <li>How long you've been in the UK</li>
                <li>Your yearly income (in brackets)</li>
                <li>Your profession/job title</li>
                <li>Your Standard Occupational Code (SOC)</li>
                <li>Your annual tax contribution (estimated)</li>
                <li>Your company's industry and size</li>
                <li>Your company's yearly revenue (in brackets)</li>
                <li>Your company's current and envisaged number of employees on visa</li>
                <li>Your immigration concerns</li>
            </ul>
            <h3>Why we collect this:</h3>
            <p>We use this information to create aggregate statistics about those impacted by immigration rule changes and to support ongoing immigration research within the remit of Not A Stranger.</p>
            <p><strong>Legal basis:</strong> Consent (GDPR Article 6(1)(a)) - you can withdraw your consent at any time by contacting us.</p>
            <h2>Optional email updates (with your consent)</h2>
            <p>If you opt in to save your email address, we will collect:</p>
            <p><strong>Personal data:</strong> Your email address</p>
            <p><strong>Why we collect this:</strong> To contact you with updates about Re:Immigration, the Not A Stranger initiative, and relevant campaigns.</p>
            <p><strong>Legal basis:</strong> Consent (GDPR Article 6(1)(a)) - you can withdraw your consent at any time by contacting us.</p>

            <h1>What we don't collect</h1>
            <p>We do not store:</p>
            <ul>
                <li>Your name</li>
                <li>Your generated email draft</li>
                <li>Your edited email draft</li>
            </ul>
            <p><strong>Note:</strong> If you mention your name or other personally identifiable information in free-text boxes, we will perform standard pseudonymisation as part of our data processing.</p>

            <h1>How we store and protect your data</h1>
            <p>Your data is stored in a database hosted on Supabase, an open-source Postgres development platform.</p>
            <p>When you use "Draft another email," the form's data resets to blank, but previously submitted data remains in our database according to the retention periods below.</p>

            <h1>How long we keep your data</h1>
            <ul>
                <li><strong>Default collected data:</strong> Retained for 1 year after collection</li>
                <li><strong>Research data:</strong> Retained for 1 year or until you withdraw consent</li>
                <li><strong>Email addresses:</strong> Retained until you unsubscribe or withdraw consent</li>
                <li><strong>Pseudonymised research data:</strong> May be retained indefinitely for research purposes</li>
            </ul>

            <h1>Your rights under GDPR</h1>
            <p>You have the right to:</p>
            <ul>
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Rectification:</strong> Ask us to correct inaccurate personal data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data (subject to certain limitations)</li>
                <li><strong>Restrict processing:</strong> Ask us to limit how we use your data</li>
                <li><strong>Data portability:</strong> Request your data in a portable format</li>
                <li><strong>Object:</strong> Object to our processing of your personal data</li>
                <li><strong>Withdraw consent:</strong> For data processed based on consent, you can withdraw it at any time</li>
            </ul>
            <p>To exercise any of these rights, please contact us at contact details above. We will respond within two weeks of receiving your request.</p>

            <h1>Complaints</h1>
            <p>If you believe we have mishandled your personal data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO). You can <a href="https://ico.org.uk/make-a-complaint/data-protection-complaints/">report a concern here</a>, but please contact us first so we can try to resolve the issue.</p>

            <h1>Third-party services</h1>
            <h2>Supabase</h2>
            <p>We use Supabase for data storage. Their privacy policy can be found on their website.</p>

            <h1>Changes to this privacy notice</h1>
            <p>We may update this privacy notice from time to time. Any significant changes will be communicated through "email notifications to users who consented to us saving their emails" and/or "prominent notice on our website".</p>

            <p><strong>Last updated:</strong> 21 July 2025</p>

            <hr />

            <h2>Contact us</h2>
            <p>If you have any questions about this privacy notice or how we handle your personal data, please contact us at:<br>
                contact[at]notastranger[dot]org</p>
        </section>
    )
}