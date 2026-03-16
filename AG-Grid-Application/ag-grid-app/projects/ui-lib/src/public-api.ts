/*
 * Public API Surface of ui-lib
 */

// Theme
export { ThemeService } from './lib/theme/theme.service';

// Button
export { UiButtonComponent } from './lib/button/button.component';

// Data Grid
export { UiDataGridComponent } from './lib/data-grid/data-grid.component';
export { AgGridLocaleService } from './lib/data-grid/ag-grid-locale.service';
export { StatusCellRendererComponent } from './lib/data-grid/cell-renderers/status-cell-renderer.component';
export { ActionsCellRendererComponent } from './lib/data-grid/cell-renderers/actions-cell-renderer.component';
export type { ActionButton } from './lib/data-grid/cell-renderers/actions-cell-renderer.component';
export { DateCellRendererComponent } from './lib/data-grid/cell-renderers/date-cell-renderer.component';

// Form
export { UiTextFieldComponent } from './lib/form/text-field/text-field.component';
export { UiSelectComponent } from './lib/form/select/select.component';
export type { UiSelectOption } from './lib/form/select/select.component';
export { UiCheckboxComponent } from './lib/form/checkbox/checkbox.component';
export { UiTextareaComponent } from './lib/form/textarea/textarea.component';
export { UiPasswordFieldComponent } from './lib/form/password-field/password-field.component';

// Dialog
export { UiDialogService, DialogRef } from './lib/dialog/dialog.service';
export type { DialogConfig } from './lib/dialog/dialog.service';
export { UiConfirmDialogComponent } from './lib/dialog/confirm-dialog.component';
export type { ConfirmDialogData } from './lib/dialog/confirm-dialog.component';

// Toolbar
export { UiToolbarComponent } from './lib/toolbar/toolbar.component';

// Tab Nav
export { UiTabNavComponent } from './lib/tab-nav/tab-nav.component';
export type { UiTabItem } from './lib/tab-nav/tab-nav.component';

// Card
export { UiCardComponent } from './lib/card/card.component';

// Menu
export { UiMenuComponent } from './lib/menu/menu.component';
export type { UiMenuItem } from './lib/menu/menu.component';

// Loading Spinner
export { UiLoadingSpinnerComponent } from './lib/loading-spinner/loading-spinner.component';

// Progress Bar
export { UiProgressBarComponent } from './lib/progress-bar/progress-bar.component';

// Snackbar
export { UiSnackbarService } from './lib/snackbar/snackbar.service';
export type { SnackbarMessage } from './lib/snackbar/snackbar.service';
export { UiSnackbarContainerComponent } from './lib/snackbar/snackbar-container.component';

// Chip
export { UiChipComponent } from './lib/chip/chip.component';

// Tooltip
export { UiTooltipDirective } from './lib/tooltip/tooltip.directive';

// Expansion Panel
export { UiExpansionPanelComponent } from './lib/expansion-panel/expansion-panel.component';

// Breadcrumb
export { UiBreadcrumbComponent } from './lib/breadcrumb/breadcrumb.component';
export type { BreadcrumbItem } from './lib/breadcrumb/breadcrumb.component';

// Stepper
export { UiStepperComponent } from './lib/stepper/stepper.component';
export type { StepDef } from './lib/stepper/stepper.component';

// Badge
export { UiBadgeComponent } from './lib/badge/badge.component';

// Search Bar
export { UiSearchBarComponent } from './lib/search-bar/search-bar.component';

// Inline Edit
export { UiInlineEditComponent } from './lib/inline-edit/inline-edit.component';

// Language Switcher
export { UiLanguageSwitcherComponent } from './lib/language-switcher/language-switcher.component';

// Theme Switcher
export { UiThemeSwitcherComponent } from './lib/theme-switcher/theme-switcher.component';

// Radio
export { UiRadioComponent } from './lib/form/radio/radio.component';
export type { UiRadioOption } from './lib/form/radio/radio.component';

// Toggle
export { UiToggleComponent } from './lib/form/toggle/toggle.component';

// Dropdown
export { UiDropdownComponent } from './lib/form/dropdown/dropdown.component';
export type { UiDropdownOption, UiDropdownLazyLoadEvent } from './lib/form/dropdown/dropdown.component';
