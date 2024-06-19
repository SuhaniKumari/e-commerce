import React from 'react'
import style from './Utils.module.css'

const Privacy = () => {
    return (
        <div className={style.Utils}>
            <div>

            <h1>Privacy Policy</h1>
            <p>
                We take your privacy seriously and are committed to protecting your
                personal information. This Privacy Policy explains how we collect, use,
                disclose, and store your information when you use our services and the
                choices you have associated with your data.
            </p>

            <h2>Information We Collect</h2>
            <ul>
                <li>
                    **Information You Provide Directly:** This includes information you
                    enter when you create an account, contact us, subscribe to our
                    services, or participate in other activities that ask for your
                    details. This may include your name, email address, phone number,
                    demographic information (optional), and any other information you
                    choose to provide.
                </li>
                <li>
                    **Automatic Data Collection:** We may collect certain information
                    automatically when you use our services. This may include your IP
                    address, browser type, operating system, device information
                    (including device identifiers), referring/exit pages, dates/times of
                    access, and data about how you interact with our services. We may
                    use cookies and similar technologies to collect this information.
                </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <ul>
                <li>
                    **To provide and improve our services:** We use your information to
                    deliver and operate our services, process your requests, personalize
                    your experience, communicate with you, and for internal research
                    and development purposes to improve our offerings.
                </li>
                <li>
                    **For security purposes:** We may use your information to help
                    identify and prevent fraud, unauthorized access, and other
                    harmful activities.
                </li>
                <li>
                    **With your consent:** We may use your information for other purposes
                    with your specific consent.
                </li>
            </ul>

            <h2>Sharing Your Information</h2>
            <p>
                We generally do not share your personal information with third parties
                without your consent. However, we may share your information in the
                following limited circumstances:
            </p>
            <ul>
                <li>
                    **With service providers:** We may share your information with
                    third-party service providers who help us operate our services,
                    such as data storage, analytics, marketing, and customer
                    support. These service providers are obligated to use your
                    information only for the purposes we disclose and in accordance
                    with this Privacy Policy.
                </li>
                <li>
                    **For legal reasons:** We may disclose your information if we are
                    required to do so by law, in response to a legal process (such as
                    a court order or subpoena), or to protect our rights or the rights
                    of others.
                </li>
                <li>
                    **In the event of a business transfer:** In the event of a business
                    transfer, such as a merger, acquisition, or asset sale, your
                    information may be transferred as part of that transaction.
                </li>
            </ul>

            <h2>Your Choices</h2>
            <p>
                You have certain choices regarding your information. These may include:
            </p>
            <ul>
                <li>
                    **Accessing and Updating Your Information:** You may have the right
                    to access and update your personal information. You can review and
                    update your information by contacting us through the methods
                    provided below.
                </li>
                <li>
                    **Opting Out of Marketing Communications:** You may have the right to
                    opt out of marketing communications we send you. You can exercise
                    this right by following the unsubscribe instructions in our emails
                    or by contacting us through the methods provided below.
                </li>
            </ul>

            <h2>Data Retention</h2>
            <p>
                We will retain your information for as long as necessary to provide
                our services, comply with our legal obligations, resolve disputes,
                and enforce our agreements. When we no longer need to retain your
                information, we will take reasonable steps to delete it securely.
            </p>
            </div>
        </div>
    )
}

export default Privacy