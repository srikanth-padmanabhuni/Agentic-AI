import { Injectable, signal } from '@angular/core';
import { WizardState, WizardDataSourceProperty, WizardTypeMapping, WizardSyncRule, WizardProjectMap, WizardFallbackUser } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ConnectionWizardService {
  private readonly initialState: WizardState = {
    mode: 'CREATE',
    currentStep: 0,
    sourceProduct: null,
    targetProduct: null,
    sourceDataSourceGuid: null,
    targetDataSourceGuid: null,
    connectionName: '',
    connectionDescription: '',
    direction: 'both',
    frequency: 60,
    enabled: true,
    sourceDataSourceProperties: [],
    targetDataSourceProperties: [],
    typeMappings: [],
    syncRules: [],
    projectMaps: [],
    fallbackUsers: [],
    existingConnectionGuid: null
  };

  readonly state = signal<WizardState>({ ...this.initialState });

  reset(): void {
    this.state.set({ ...this.initialState });
  }

  initForEdit(existingGuid: string): void {
    this.state.update(s => ({ ...s, mode: 'UPDATE', existingConnectionGuid: existingGuid }));
  }

  setStep(step: number): void {
    this.state.update(s => ({ ...s, currentStep: step }));
  }

  nextStep(): void {
    this.state.update(s => ({ ...s, currentStep: Math.min(s.currentStep + 1, 3) }));
  }

  prevStep(): void {
    this.state.update(s => ({ ...s, currentStep: Math.max(s.currentStep - 1, 0) }));
  }

  updateBasicInfo(data: Partial<Pick<WizardState, 'sourceProduct' | 'targetProduct' | 'connectionName' | 'connectionDescription' | 'direction' | 'frequency' | 'enabled'>>): void {
    this.state.update(s => ({ ...s, ...data }));
  }

  setSourceProperties(props: WizardDataSourceProperty[]): void {
    this.state.update(s => ({ ...s, sourceDataSourceProperties: props }));
  }

  setTargetProperties(props: WizardDataSourceProperty[]): void {
    this.state.update(s => ({ ...s, targetDataSourceProperties: props }));
  }

  setTypeMappings(mappings: WizardTypeMapping[]): void {
    this.state.update(s => ({ ...s, typeMappings: mappings }));
  }

  setSyncRules(rules: WizardSyncRule[]): void {
    this.state.update(s => ({ ...s, syncRules: rules }));
  }

  setProjectMaps(maps: WizardProjectMap[]): void {
    this.state.update(s => ({ ...s, projectMaps: maps }));
  }

  setFallbackUsers(users: WizardFallbackUser[]): void {
    this.state.update(s => ({ ...s, fallbackUsers: users }));
  }
}
