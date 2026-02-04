// Job Schema Injector - Injects JSON-LD structured data into page head for SEO
import { addPropertyControls, ControlType, RenderTarget } from "framer";
import { useEffect } from "react";

interface JobSchemaInjectorProps {
  // Core Job Details
  jobId: string;
  jobTitle: string;
  descriptionElementId: string;
  jobSlug: string;
  publishedAt: string;

  // Employment Details
  employmentType: string;
  isRemote: boolean;

  // Location
  country: string;

  // Compensation
  showCompensation: boolean;
  compensationRange: string;

  // Organization (optional overrides)
  companyName: string;
  companyUrl: string;
  companyLogoUrl: string;
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 */
export default function JobSchemaInjector(props: JobSchemaInjectorProps) {
  const {
    jobId = "",
    jobTitle = "",
    descriptionElementId = "job-description",
    jobSlug = "",
    publishedAt = "",
    employmentType = "FULL_TIME",
    isRemote = false,
    country = "",
    showCompensation = false,
    compensationRange = "",
    companyName = "hyperexponential",
    companyUrl = "https://www.hyperexponential.com",
    companyLogoUrl = "https://www.hyperexponential.com/logo.png",
  } = props;

  // Map country names to ISO country codes
  const mapCountryCode = (countryInput: string): string => {
    const countryMap: Record<string, string> = {
      "United States": "US",
      "United Kingdom": "GB",
      Poland: "PL",
    };
    return countryMap[countryInput] || countryInput;
  };

  // Map country to office address details
  const getOfficeAddress = (countryInput: string) => {
    const offices: Record<
      string,
      { street: string; locality: string; region: string; postal: string }
    > = {
      "United Kingdom": {
        street: "The Ministry, 79-81 Borough Rd",
        locality: "London",
        region: "London",
        postal: "SE1 1DN",
      },
      "United States": {
        street: "500 7th Avenue, 8th Floor",
        locality: "New York",
        region: "NY",
        postal: "10018",
      },
      Poland: {
        street: "The Brain Embassy, Tadeusza Czackiego 15/17",
        locality: "Warszawa",
        region: "Mazowieckie",
        postal: "00-043",
      },
    };
    return offices[countryInput] || null;
  };

  // Build the apply URL from slug
  const applyUrl = jobSlug
    ? `https://www.hyperexponential.com/careers/openings/${jobSlug}`
    : "";

  useEffect(() => {
    // Parse American date format (M/D/YY or MM/DD/YY) to ISO 8601 (YYYY-MM-DD)
    const parseToISODate = (dateStr: string): string => {
      if (!dateStr) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      const americanMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (americanMatch) {
        const month = americanMatch[1].padStart(2, "0");
        const day = americanMatch[2].padStart(2, "0");
        let year = americanMatch[3];
        if (year.length === 2) year = "20" + year;
        return `${year}-${month}-${day}`;
      }
      return dateStr;
    };

    // Parse compensation range (e.g., "$85k - $100k" or "$80,000 - $120,000")
    const parseCompensation = (range: string) => {
      if (!range) return null;
      const matches = range.match(/\$?([\d,]+)(k)?/gi);
      if (!matches || matches.length === 0) return null;
      const parseValue = (match: string): number => {
        const hasK = match.toLowerCase().includes("k");
        const num = parseInt(match.replace(/[$,k]/gi, ""), 10);
        return hasK ? num * 1000 : num;
      };
      if (matches.length === 1) return { value: parseValue(matches[0]) };
      return {
        minValue: parseValue(matches[0]),
        maxValue: parseValue(matches[1]),
      };
    };

    // Map employment type to Google's expected format
    const mapEmploymentType = (type: string): string => {
      const typeMap: Record<string, string> = {
        "full-time": "FULL_TIME",
        "full time": "FULL_TIME",
        fulltime: "FULL_TIME",
        "part-time": "PART_TIME",
        "part time": "PART_TIME",
        parttime: "PART_TIME",
        contract: "CONTRACTOR",
        contractor: "CONTRACTOR",
        temporary: "TEMPORARY",
        temp: "TEMPORARY",
        intern: "INTERN",
        internship: "INTERN",
        volunteer: "VOLUNTEER",
        "per diem": "PER_DIEM",
        perdiem: "PER_DIEM",
      };
      const normalized = type.toLowerCase().trim();
      return typeMap[normalized] || type.toUpperCase().replace(/[\s-]/g, "_");
    };

    // Strip compensation markup tags {{bonus=...}}, {{commission=...}}, {{equity=...}}
    const stripCompensationTags = (html: string): string => {
      return html.replace(/\{\{(bonus|commission|equity)=([^}]+)\}\}/gi, "");
    };

    // Sanitize HTML: keep only semantic tags, strip Framer classes/attributes
    const sanitizeHtml = (html: string): string => {
      if (!html) return "";
      // First strip compensation markup tags
      const cleanedHtml = stripCompensationTags(html);
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanedHtml, "text/html");
      const allowedTags = new Set([
        "p",
        "br",
        "strong",
        "em",
        "b",
        "i",
        "u",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "span",
        "div",
      ]);
      const cleanNode = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
        if (node.nodeType !== Node.ELEMENT_NODE) return "";
        const el = node as Element;
        const tagName = el.tagName.toLowerCase();
        const childContent = Array.from(el.childNodes).map(cleanNode).join("");
        if (!childContent.trim()) return "";
        if (allowedTags.has(tagName)) {
          if (tagName === "a") {
            const href = el.getAttribute("href");
            return href
              ? `<a href="${href}">${childContent}</a>`
              : childContent;
          }
          return `<${tagName}>${childContent}</${tagName}>`;
        }
        return childContent;
      };
      return cleanNode(doc.body);
    };

    const scriptId = `job-posting-schema-${jobId || "default"}`;

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Extract and sanitize description from DOM
      const descriptionElement = document.getElementById(descriptionElementId);
      const rawHtml = descriptionElement?.innerHTML || "";
      const jobDescription = sanitizeHtml(rawHtml);

      // Build the JSON-LD schema
      const schema: Record<string, any> = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        title: jobTitle,
        description: jobDescription,
        datePosted: parseToISODate(publishedAt),
        hiringOrganization: {
          "@type": "Organization",
          name: companyName,
          sameAs: companyUrl,
          logo: companyLogoUrl,
        },
        identifier: {
          "@type": "PropertyValue",
          name: companyName,
          value: jobId,
        },
      };

      // Add employment type
      if (employmentType) {
        schema.employmentType = mapEmploymentType(employmentType);
      }

      // Add job location
      const countryCode = country ? mapCountryCode(country) : "";
      const officeAddress = country ? getOfficeAddress(country) : null;
      if (officeAddress || countryCode) {
        schema.jobLocation = {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            ...(officeAddress?.street && {
              streetAddress: officeAddress.street,
            }),
            ...(officeAddress?.locality && {
              addressLocality: officeAddress.locality,
            }),
            ...(officeAddress?.region && {
              addressRegion: officeAddress.region,
            }),
            ...(officeAddress?.postal && {
              postalCode: officeAddress.postal,
            }),
            ...(countryCode && { addressCountry: countryCode }),
          },
        };
      }

      // Add remote work indicator
      if (isRemote) {
        schema.jobLocationType = "TELECOMMUTE";
        if (countryCode) {
          schema.applicantLocationRequirements = {
            "@type": "Country",
            name: countryCode,
          };
        }
      }

      // Add compensation if enabled and provided
      if (showCompensation && compensationRange) {
        const compensation = parseCompensation(compensationRange);
        if (compensation) {
          schema.baseSalary = {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: {
              "@type": "QuantitativeValue",
              ...compensation,
              unitText: "YEAR",
            },
          };
        }
      }

      // Add direct apply indicator
      if (applyUrl) {
        schema.directApply = true;
      }

      // Remove existing script if present
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }

      // Create and inject the script tag
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [
    jobId,
    jobTitle,
    descriptionElementId,
    jobSlug,
    publishedAt,
    employmentType,
    isRemote,
    country,
    showCompensation,
    compensationRange,
    applyUrl,
    companyName,
    companyUrl,
    companyLogoUrl,
  ]);

  const isCanvas = RenderTarget.current() === RenderTarget.canvas;

  // Show placeholder in Framer canvas, invisible on live site
  if (isCanvas) {
    return (
      <div
        style={{
          padding: "12px 16px",
          background: "#f0f0f0",
          border: "1px dashed #ccc",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#666",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Job Schema Injector{" "}
        {jobTitle ? `- ${jobTitle}` : "(connect CMS fields)"}
      </div>
    );
  }

  // Invisible on live site - only injects the schema
  return null;
}

JobSchemaInjector.displayName = "Job Schema Injector";

addPropertyControls(JobSchemaInjector, {
  // Core Job Details
  jobId: {
    type: ControlType.String,
    title: "Job ID",
    description: "Unique identifier from Ashby",
    defaultValue: "",
  },
  jobSlug: {
    type: ControlType.String,
    title: "Job Slug",
    description:
      "URL slug for the job listing (builds apply URL automatically)",
    defaultValue: "",
  },
  jobTitle: {
    type: ControlType.String,
    title: "Job Title",
    description: "Position title (e.g., Senior Software Engineer)",
    defaultValue: "",
  },
  descriptionElementId: {
    type: ControlType.String,
    title: "Description Element ID",
    description:
      "ID of the DOM element containing the job description (without #)",
    defaultValue: "job-description",
  },
  publishedAt: {
    type: ControlType.String,
    title: "Published Date",
    description: "Date posted (ISO 8601 format: YYYY-MM-DD)",
    defaultValue: "",
  },

  // Employment Details
  employmentType: {
    type: ControlType.String,
    title: "Employment Type",
    description: "Type of employment (e.g., Full Time, Part Time, Contract)",
    defaultValue: "",
  },
  isRemote: {
    type: ControlType.Boolean,
    title: "Remote Position",
    description: "Is this a 100% remote/telecommute position?",
    defaultValue: false,
    enabledTitle: "Yes",
    disabledTitle: "No",
  },

  // Location
  country: {
    type: ControlType.String,
    title: "Country",
    description:
      "Country name (United States, United Kingdom, Poland) - address auto-filled",
    defaultValue: "",
  },

  // Compensation
  showCompensation: {
    type: ControlType.Boolean,
    title: "Show Compensation",
    description: "Include salary in structured data?",
    defaultValue: false,
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  compensationRange: {
    type: ControlType.String,
    title: "Compensation Range",
    description: "Salary range (e.g., $80,000 - $120,000)",
    defaultValue: "",
    hidden: (props) => !props.showCompensation,
  },

  // Organization (collapsible section)
  companyName: {
    type: ControlType.String,
    title: "Company Name",
    description: "Hiring organization name",
    defaultValue: "hyperexponential",
  },
  companyUrl: {
    type: ControlType.String,
    title: "Company URL",
    description: "Company website URL",
    defaultValue: "https://www.hyperexponential.com",
  },
  companyLogoUrl: {
    type: ControlType.String,
    title: "Company Logo URL",
    description: "URL to company logo image",
    defaultValue: "https://www.hyperexponential.com/logo.png",
  },
});
