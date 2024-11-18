'use client'
import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Input } from '~/components/input';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useFormInput } from '~/hooks';
import { useRef } from 'react';
import { cssProps, msToNum, numToMs } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { json } from '@remix-run/cloudflare';
import emailjs from "@emailjs/browser";
import styles from './contact.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Contact',
    description:
      'Send me a message if you’re interested in discussing a project or if you just want to say hi',
  });
};
emailjs.init("Fw1JaWi8CImATBuGr");
const MAX_EMAIL_LENGTH = 512;
const MAX_MESSAGE_LENGTH = 4096;
const EMAIL_PATTERN = /(.+)@(.+){2,}\.(.+){2,}/;



export async function action({ request }) {
  console.log('Action function called');
  const formData = await request.formData();
  console.log('Form data received:', formData);
  const isBot = String(formData.get('bot_field')); // Honeypot field
  const name = String(formData.get('name'));
  const email = String(formData.get('email'));
  const subject = String(formData.get('subject'));
  const message = String(formData.get('message'));
  const errors = {};

  // Return without sending if a bot trips the honeypot
  if (isBot) return json({ success: true });

  // Validation
  if (!name || name.trim().length < 2) {
    errors.name = 'Please enter a valid name with at least 2 characters.';
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!subject || subject.trim().length < 3) {
    errors.subject = 'Please enter a valid subject.';
  }
  if (!message) {
    errors.message = 'Please enter a message.';
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // Send email via EmailJS
  try {

    const emailResponse = await emailjs
  .send("service_mqqwwht", "template_zw9h2hv", {
        user_name: name,
        user_email: email,
        subject: subject,
        message: message,
      }
  )
  .then(
    (result) => {
      return json({ success: true });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setLoading(false);
      toast.success("Successfully sent email.");
    },
    (error) => {
      // setLoading(false);
      // console.log(error);
      throw new Error(`Email failed with status: ${emailResponse.status}`);
      // toast.error(error.text);
    }
  );
    console.log('EmailJS response:', emailResponse);
    if (emailResponse.status === 200) {
      return json({ success: true });
    } else {
      throw new Error(`Email failed with status: ${emailResponse.status}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return json({
      errors: {
        general: 'There was a problem sending your message. Please try again later.',
      },
    });  
  }
}



export const Contact = () => {
  const errorRef = useRef();
  const name = useFormInput(''); // Add Name input
  const email = useFormInput('');
  const subject = useFormInput(''); // Add Subject input
  const message = useFormInput('');
  const initDelay = tokens.base.durationS;
  const actionData = useActionData();
  const { state } = useNavigation();
  const sending = state === 'submitting';

  return (
    <Section className={styles.contact}>
      <Transition unmount in={!actionData?.success} timeout={1600}>
        {({ status, nodeRef }) => (
          <Form
            unstable_viewTransition
            className={styles.form}
            method="post"
            ref={nodeRef}
          >
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
            {/* Hidden honeypot field to identify bots */}
            <Input
              className={styles.botkiller}
              label="Bot Field"
              name="bot_field"
              maxLength={MAX_EMAIL_LENGTH}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="name"
              label="Your Name"
              name="name"
              maxLength={100}
              {...name}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="email"
              label="Your Email"
              type="email"
              name="email"
              maxLength={MAX_EMAIL_LENGTH}
              {...email}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="off"
              label="Subject"
              name="subject"
              maxLength={200}
              {...subject}
            />
            <Input
              required
              multiline
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label="Message"
              name="message"
              maxLength={MAX_MESSAGE_LENGTH}
              {...message}
            />
            <Transition
              unmount
              in={!sending && actionData?.errors}
              timeout={msToNum(tokens.base.durationM)}
            >
              {({ status: errorStatus, nodeRef }) => (
                <div
                  className={styles.formError}
                  ref={nodeRef}
                  data-status={errorStatus}
                  style={cssProps({
                    height: errorStatus ? errorRef.current?.offsetHeight : 0,
                  })}
                >
                  <div className={styles.formErrorContent} ref={errorRef}>
                    <div className={styles.formErrorMessage}>
                      <Icon className={styles.formErrorIcon} icon="error" />
                      {actionData?.errors?.name}
                      {actionData?.errors?.email}
                      {actionData?.errors?.subject}
                      {actionData?.errors?.message}
                    </div>
                  </div>
                </div>
              )}
            </Transition>
            <Button
              className={styles.button}
              data-status={status}
              data-sending={sending}
              style={getDelay(tokens.base.durationM, initDelay)}
              disabled={sending}
              loading={sending}
              loadingText="Sending..."
              icon="send"
              type="submit"
            >
              Send message
            </Button>
          </Form>
        )}
      </Transition>
      <Transition unmount in={actionData?.success}>
        {({ status, nodeRef }) => (
          <div className={styles.complete} aria-live="polite" ref={nodeRef}>
            <Heading
              level={3}
              as="h3"
              className={styles.completeTitle}
              data-status={status}
            >
              Message Sent
            </Heading>
            <Text
              size="l"
              as="p"
              className={styles.completeText}
              data-status={status}
              style={getDelay(tokens.base.durationXS)}
            >
              I’ll get back to you within a couple days, sit tight
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href="/"
              icon="chevron-right"
            >
              Back to homepage
            </Button>
          </div>
        )}
      </Transition>
      <Footer className={styles.footer} />
    </Section>
  );
};


function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
