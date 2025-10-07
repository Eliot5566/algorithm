import { DataStore, FormDefinition } from '../utils/datastore';

export interface FormTriggerResult {
  formId?: number;
  schema?: any;
}

function matches(text: string, form: FormDefinition): boolean {
  const haystack = text.toLowerCase();
  return form.trigger_keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

export function findTriggeredForm(tenantId: number, text: string): FormTriggerResult {
  const store = DataStore.getInstance();
  const forms = store.listForms(tenantId);
  const found = forms.find((form) => matches(text, form));
  if (!found) {
    return {};
  }
  return { formId: found.id, schema: found.schema };
}
