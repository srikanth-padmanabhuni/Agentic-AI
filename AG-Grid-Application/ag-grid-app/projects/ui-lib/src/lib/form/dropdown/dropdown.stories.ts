import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, signal } from '@angular/core';
import { UiDropdownComponent, UiDropdownOption, UiDropdownLazyLoadEvent } from './dropdown.component';

const COUNTRIES: UiDropdownOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' },
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
  { value: 'br', label: 'Brazil' },
  { value: 'mx', label: 'Mexico' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'kr', label: 'South Korea' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'se', label: 'Sweden' },
];

const ROLES: UiDropdownOption[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'guest', label: 'Guest', disabled: true },
];

/**
 * Inline wrapper for lazy-load demo — keeps state in a real component
 * so Storybook can drive a controlled loading simulation.
 */
@Component({
  selector: 'story-lazy-dropdown',
  standalone: true,
  imports: [UiDropdownComponent],
  template: `
    <ui-dropdown
      label="City"
      placeholder="Search cities…"
      [searchable]="true"
      [lazyLoad]="true"
      [lazyPageSize]="10"
      [loading]="loading()"
      [options]="options()"
      (lazyLoadRequest)="onLazy($event)" />
  `,
})
class StoryLazyDropdownComponent {
  /** Full dataset to simulate server-side filtering */
  private readonly allCities: UiDropdownOption[] = [
    { value: 'nyc', label: 'New York' },
    { value: 'lax', label: 'Los Angeles' },
    { value: 'chi', label: 'Chicago' },
    { value: 'hou', label: 'Houston' },
    { value: 'phx', label: 'Phoenix' },
    { value: 'phi', label: 'Philadelphia' },
    { value: 'san', label: 'San Antonio' },
    { value: 'sd', label: 'San Diego' },
    { value: 'dal', label: 'Dallas' },
    { value: 'sj', label: 'San Jose' },
    { value: 'aus', label: 'Austin' },
    { value: 'jax', label: 'Jacksonville' },
    { value: 'sf', label: 'San Francisco' },
    { value: 'col', label: 'Columbus' },
    { value: 'ind', label: 'Indianapolis' },
    { value: 'ftw', label: 'Fort Worth' },
    { value: 'cha', label: 'Charlotte' },
    { value: 'sea', label: 'Seattle' },
    { value: 'den', label: 'Denver' },
    { value: 'el', label: 'El Paso' },
    { value: 'det', label: 'Detroit' },
    { value: 'nas', label: 'Nashville' },
    { value: 'mem', label: 'Memphis' },
    { value: 'por', label: 'Portland' },
    { value: 'okc', label: 'Oklahoma City' },
    { value: 'lv', label: 'Las Vegas' },
    { value: 'lou', label: 'Louisville' },
    { value: 'bal', label: 'Baltimore' },
    { value: 'mil', label: 'Milwaukee' },
    { value: 'abq', label: 'Albuquerque' },
  ];

  readonly options = signal<UiDropdownOption[]>([]);
  readonly loading = signal(false);

  onLazy(event: UiDropdownLazyLoadEvent): void {
    this.loading.set(true);
    // Simulate network delay
    setTimeout(() => {
      const filtered = this.allCities.filter(c =>
        c.label.toLowerCase().includes(event.query.toLowerCase())
      );
      const page = filtered.slice(0, event.offset + event.limit);
      this.options.set(page);
      this.loading.set(false);
    }, 600);
  }
}

const meta: Meta<UiDropdownComponent> = {
  title: 'Form/Dropdown',
  component: UiDropdownComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ReactiveFormsModule] })],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    searchable: { control: 'boolean' },
    required: { control: 'boolean' },
    multiple: { control: 'boolean' },
    lazyLoad: { control: 'boolean' },
    loading: { control: 'boolean' },
    noResultsText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<UiDropdownComponent>;

export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: COUNTRIES,
  },
};

export const WithSearch: Story = {
  args: {
    label: 'Country',
    placeholder: 'Type to search…',
    searchable: true,
    options: COUNTRIES,
  },
};

export const WithoutSearch: Story = {
  args: {
    label: 'Role',
    placeholder: 'Choose a role',
    searchable: false,
    options: ROLES,
  },
};

export const MultiSelect: Story = {
  args: {
    label: 'Countries',
    placeholder: 'Select countries',
    multiple: true,
    searchable: true,
    options: COUNTRIES,
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: 'Role',
    placeholder: 'Select a role',
    options: ROLES,
  },
};

export const Required: Story = {
  args: {
    label: 'Country',
    placeholder: 'Required field',
    required: true,
    options: COUNTRIES,
  },
};

export const WithError: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    required: true,
    options: COUNTRIES,
    errors: { required: true },
    errorMessages: { required: 'This field is required' },
  },
};

export const LazyLoad: Story = {
  render: () => ({
    component: StoryLazyDropdownComponent,
    props: {},
  }),
};

export const Empty: Story = {
  args: {
    label: 'Items',
    placeholder: 'No options available',
    searchable: true,
    options: [],
  },
};

export const ManyOptions: Story = {
  args: {
    label: 'City',
    placeholder: 'Search or scroll…',
    searchable: true,
    options: Array.from({ length: 100 }, (_, i) => ({
      value: `city-${i}`,
      label: `City ${i + 1}`,
    })),
  },
};
