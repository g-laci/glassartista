'use client'

import {useRef, useState} from "react";
import {Button, Form, Input, Skeleton, Spinner, Textarea} from "@heroui/react";
import ReCAPTCHA from "react-google-recaptcha";

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const EMPTY_FIELDS = {name: "", email: "", message: ""};

const isComplete = (fields) =>
    fields.name.trim().length > 0 && EMAIL_PATTERN.test(fields.email) && fields.message.trim().length > 0;

/**
 * Contact form posting to /api/contact. Name, e-mail and message are controlled (validated on
 * blur); phone and subject are uncontrolled. Sending requires a completed reCAPTCHA.
 *
 * @param site   "glassartista" | "tiffanystudio" (selects the receiving mailbox)
 * @param locale UI language of the reCAPTCHA widget
 * @param t      localized labels and messages (`thanks` contains a `{name}` placeholder)
 */
export default function ContactForm({site, locale, t}) {
    const [fields, setFields] = useState(EMPTY_FIELDS);
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [submittedName, setSubmittedName] = useState(null);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
    const recaptchaRef = useRef(null);

    const handleBlur = (event) => setTouched((current) => ({...current, [event.target.name]: true}));
    const handleChange = (event) => setFields((current) => ({...current, [event.target.name]: event.target.value}));
    const errorIf = (field, isInvalid, message) => (touched[field] && isInvalid ? message : null);

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        // Captured now: event.currentTarget is no longer set after the await below.
        const form = event.currentTarget;
        const data = {...Object.fromEntries(new FormData(form)), site};
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                setSubmittedName(data.name);
                form.reset(); // clears the uncontrolled phone and subject fields
                setFields(EMPTY_FIELDS);
                setTouched({});
                setRecaptchaToken(null);
                recaptchaRef.current?.reset();
            } else {
                alert('Something went wrong');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form className="w-full" onSubmit={onSubmit} validationBehavior="aria">
            <div className="flex flex-row gap-6 w-full">
                <Input
                    isRequired
                    label={t.name}
                    labelPlacement="outside"
                    name="name"
                    type="text"
                    variant="bordered"
                    fullWidth={true}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={fields.name}
                    validate={(value) => errorIf('name', value.length === 0, t.requiredName)}
                />
                <Input label={t.tel} labelPlacement="outside" name="tel" type="tel" variant="bordered"/>
            </div>
            <Input
                isRequired
                label={t.email}
                labelPlacement="outside"
                name="email"
                type="email"
                variant="bordered"
                onBlur={handleBlur}
                onChange={handleChange}
                value={fields.email}
                validate={(value) => errorIf('email', !EMAIL_PATTERN.test(value), t.requiredEmail)}
            />
            <Input label={t.subject} labelPlacement="outside" name="text" type="text" variant="bordered"/>
            <Textarea
                className="py-5"
                isRequired
                label={t.message}
                labelPlacement="outside"
                name="message"
                type="text"
                rows={5}
                minRows={5}
                maxRows={20}
                variant="bordered"
                onBlur={handleBlur}
                onChange={handleChange}
                value={fields.message}
                validate={(value) => errorIf('message', value.length === 0, t.requiredMessage)}
            />
            {!recaptchaLoaded && (
                <Skeleton className="rounded-sm">
                    <div className="h-[70px] w-[304px] rounded-sm bg-default-300"/>
                </Skeleton>
            )}
            <div style={{colorScheme: "light"}}>
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={setRecaptchaToken}
                    asyncScriptOnLoad={() => setRecaptchaLoaded(true)}
                    theme="dark"
                    hl={locale}
                />
            </div>
            <Button
                type="submit"
                variant="bordered"
                isDisabled={!isComplete(fields) || !recaptchaToken || loading}
                startContent={loading ? <Spinner size="sm" color="primary"/> : undefined}
            >
                {t.send}
            </Button>
            {submittedName !== null && (
                <div className="text-small text-default-500">
                    {t.thanks.replace('{name}', submittedName)}
                </div>
            )}
        </Form>
    );
}
