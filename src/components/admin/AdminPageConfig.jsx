import { useEffect, useState } from "react";

import {
  getPublicPageConfig,
  updatePageConfig,
} from "../../services/pageConfig.service.js";

function AdminPageConfig() {
  const [pageConfig, setPageConfig] = useState({
    heading: "",
    stageTwoHeading: "",
  });

  const [configLoading, setConfigLoading] = useState(true);
  const [configSaving, setConfigSaving] = useState(false);
  const [configError, setConfigError] = useState("");
  const [configNotice, setConfigNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchPageConfig() {
      try {
        setConfigLoading(true);
        setConfigError("");

        const response = await getPublicPageConfig();

        const config = response?.data?.data ?? response?.data ?? response;

        if (isMounted) {
          setPageConfig({
            heading: config?.heading || "",
            stageTwoHeading: config?.stageTwoHeading || "",
          });
        }
      } catch (err) {
        if (isMounted) {
          setConfigError(
            err?.response?.data?.message ||
              "Failed to load page configuration.",
          );
        }
      } finally {
        if (isMounted) {
          setConfigLoading(false);
        }
      }
    }

    fetchPageConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSavePageConfig(event) {
    event.preventDefault();

    const heading = pageConfig.heading.trim();
    const stageTwoHeading = pageConfig.stageTwoHeading.trim();

    if (!heading || !stageTwoHeading) {
      setConfigError("Both headings are required.");
      return;
    }

    try {
      setConfigSaving(true);
      setConfigError("");
      setConfigNotice("");

      await updatePageConfig({
        heading,
        stageTwoHeading,
      });

      setPageConfig({
        heading,
        stageTwoHeading,
      });

      setConfigNotice("Public form headings updated successfully.");
    } catch (err) {
      setConfigError(
        err?.response?.data?.message || "Failed to update page headings.",
      );
    } finally {
      setConfigSaving(false);
    }
  }

  return (
    <section className="vf-admin-panel">
      <h3>Public Form Configuration</h3>

      <p>Manage the headings displayed on your public form.</p>

      {configError && <p className="vf-admin-error">{configError}</p>}

      {configNotice && <p className="vf-admin-notice">{configNotice}</p>}

      {configLoading ? (
        <p>Loading configuration...</p>
      ) : (
        <form className="vf-admin-filters" onSubmit={handleSavePageConfig}>
          <input
            type="text"
            placeholder="Stage 1 heading"
            maxLength={120}
            value={pageConfig.heading}
            onChange={(event) =>
              setPageConfig((previous) => ({
                ...previous,
                heading: event.target.value,
              }))
            }
          />

          <input
            type="text"
            placeholder="Stage 2 heading"
            maxLength={120}
            value={pageConfig.stageTwoHeading}
            onChange={(event) =>
              setPageConfig((previous) => ({
                ...previous,
                stageTwoHeading: event.target.value,
              }))
            }
          />

          <button type="submit" disabled={configSaving}>
            {configSaving ? "Saving..." : "Save Headings"}
          </button>
        </form>
      )}
    </section>
  );
}

export default AdminPageConfig;
