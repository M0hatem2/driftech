import { Injectable } from '@angular/core';
import { PersonalInformationStateService } from '../../features/client/finance/components/finance-personal-information/services/personal-information-state.service';
import { WorkDetailsStateService } from '../../features/client/finance/components/finance-work-details/services/work-details-state.service';
import { ReferencePersonStateService } from '../../features/client/finance/components/finance-reference-person/services/reference-person-state.service';
import { CarModelsService } from '../../features/client/finance/components/finance-reference-person/services/car-models.service';
import { FinancingRequestFormData, FinancingRequestService } from './financing-request.service';

export interface CombinedFormData {
  personalInfo: {
    fullName: string;
    phoneNumber: string;
    email: string;
    governorate: string;
  };
  workDetails: {
    occupationType: string;
    jobTitle: string;
    monthlyIncome: string;
  };
  referencePerson: {
    totalPrice: string;
    downPayment: string;
    hasSpecificCar: string;
    specificCarBrand: string;
    specificCarModel: string;
    specificCarYear: string;
    specificCarPrice: string;
    selectedCarTypes: string[];
    searchCarBrand: string;
    searchCarModel: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FinanceDataCollectionService {
  constructor(
    private personalInfoService: PersonalInformationStateService,
    private workDetailsService: WorkDetailsStateService,
    private referencePersonService: ReferencePersonStateService,
    private carModelsService: CarModelsService,
    private financingRequestService: FinancingRequestService
  ) {}

  /**
   * Collect all form data from all components
   */
  collectAllFormData(): CombinedFormData {
    return {
      personalInfo: this.personalInfoService.getFormData(),
      workDetails: this.workDetailsService.getFormData(),
      referencePerson: this.referencePersonService.getFormData(),
    };
  }

  /**
   * Check if all required data is filled
   */
  isAllDataComplete(): { isComplete: boolean; missingFields: string[] } {
    const combinedData = this.collectAllFormData();
    const missingFields: string[] = [];

    // Check personal information
    const personalInfo = combinedData.personalInfo;
    if (!personalInfo.fullName.trim()) missingFields.push('FULL_NAME');
    if (!personalInfo.phoneNumber.trim()) missingFields.push('PHONE_NUMBER');
    if (!personalInfo.email.trim()) missingFields.push('EMAIL_ADDRESS');
    if (!personalInfo.governorate.trim()) missingFields.push('GOVERNORATE');

    // Identity photos are now optional - no validation required

    // Check work details
    const workDetails = combinedData.workDetails;
    if (!workDetails.occupationType) missingFields.push('OCCUPATION_TYPE');
    if (!workDetails.jobTitle.trim()) missingFields.push('JOB_TITLE');
    if (!workDetails.monthlyIncome.trim()) missingFields.push('MONTHLY_INCOME');

    // Check reference person data
    const referencePerson = combinedData.referencePerson;
    if (!referencePerson.totalPrice.trim()) missingFields.push('CAR_PRICE');
    if (!referencePerson.downPayment.trim()) missingFields.push('DOWN_PAYMENT');
    if (!referencePerson.hasSpecificCar) missingFields.push('SPECIFIC_CAR_QUESTION');

    if (referencePerson.hasSpecificCar === 'yes') {
      if (!referencePerson.specificCarBrand.trim()) missingFields.push('CAR_BRAND');
      if (!referencePerson.specificCarModel.trim()) missingFields.push('CAR_MODEL');
      if (!referencePerson.specificCarYear.trim()) missingFields.push('CAR_MODEL_YEAR');
      if (!referencePerson.specificCarPrice.trim()) missingFields.push('CAR_PRICE');
    } else if (referencePerson.hasSpecificCar === 'no') {
      if (referencePerson.selectedCarTypes.length === 0) missingFields.push('CAR_TYPES_MULTIPLE');
      if (!referencePerson.searchCarBrand.trim()) missingFields.push('SELECT_CAR_BRAND');
      if (!referencePerson.searchCarModel.trim()) missingFields.push('SELECT_CAR_MODEL');
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Convert collected data to financing request form data
   */
  convertToFinancingRequestData(
    cardFront: File | null,
    cardBack: File | null,
    contactInfo: { fullName: string; phoneNumber: string; email: string }
  ): FinancingRequestFormData {
    const combinedData = this.collectAllFormData();

    // Extract personal info
    const personalInfo = combinedData.personalInfo;
    const governorateId = this.extractGovernorateId(personalInfo.governorate);

    // Extract work details
    const workDetails = combinedData.workDetails;

    // Extract car info from reference person
    const referencePerson = combinedData.referencePerson;

    // Determine car brand and model based on selection type
    let carBrand = '';
    let carModel = '';
    let modelYear = '';
    let carPrice = 0;
    let preferredBrand: string | null = null;

    if (referencePerson.hasSpecificCar === 'yes') {
      carBrand = referencePerson.specificCarBrand;
      carModel = referencePerson.specificCarModel;
      modelYear = referencePerson.specificCarYear;
      carPrice = parseFloat(referencePerson.specificCarPrice) || 0;
    } else if (referencePerson.hasSpecificCar === 'no') {
      carBrand = referencePerson.searchCarBrand;
      carModel = referencePerson.searchCarModel;
      preferredBrand = referencePerson.searchCarBrand; // For search, preferred brand is the selected brand
      // Use total price for car price
      carPrice = parseFloat(referencePerson.totalPrice) || 0;
      modelYear = new Date().getFullYear().toString(); // Default current year
    }

    const result: any = {
      full_name: personalInfo.fullName,
      phone_number: personalInfo.phoneNumber,
      email: personalInfo.email,
      governorate_id: governorateId,
      area_id: 1, // Default area ID (can be updated later if needed)
      occupation_type: workDetails.occupationType,
      monthly_income: workDetails.monthlyIncome,
      job_title: workDetails.jobTitle,
      car_brand: carBrand,
      car_model: carModel,
      model_year: modelYear,
      preferred_brand: preferredBrand,
      car_price: carPrice,
      down_payment: parseFloat(referencePerson.downPayment) || 0,
    };

    // Only include file fields if they exist
    if (cardFront) {
      result.card_front = cardFront;
    }
    if (cardBack) {
      result.card_back = cardBack;
    }

    return result;
  }

  /**
   * Extract governorate ID from name (mock implementation - adjust based on your data)
   */
  private extractGovernorateId(governorateName: string): number {
    // This is a mock implementation. You should have a proper mapping
    // of governorate names to IDs from your governorates data
    const governorateMap: { [key: string]: number } = {
      Cairo: 1,
      Alexandria: 2,
      Giza: 3,
      Luxor: 4,
      Aswan: 5,
      Asyut: 6,
      Beheira: 7,
      'Beni Suef': 8,
      Dakahlia: 9,
      Damietta: 10,
      Fayyum: 11,
      Gharbia: 12,
      Ismailia: 13,
      'Kafr el-Sheikh': 14,
      Matrouh: 15,
      Minya: 16,
      Monufia: 17,
      'New Valley': 18,
      'North Sinai': 19,
      'Port Said': 20,
      Qalyubia: 21,
      Qena: 22,
      'Red Sea': 23,
      Sharqia: 24,
      Sohag: 25,
      'South Sinai': 26,
      Suez: 27,
    };

    return governorateMap[governorateName] || 1; // Default to Cairo if not found
  }

  /**
   * Extract area ID from district name (mock implementation)
   */
  private extractAreaId(districtName: string): number {
    // This is a mock implementation. You should have a proper mapping
    // of district names to IDs from your areas/districts data
    const areaMap: { [key: string]: number } = {
      Maadi: 1,
      Zamalek: 2,
      'New Cairo': 3,
      'Nasr City': 4,
      Heliopolis: 5,
      Mokattam: 6,
      '6th of October': 7,
      'Sheikh Zayed': 8,
      'El Rehab': 9,
      'New Administrative Capital': 10,
    };

    return areaMap[districtName] || 1; // Default if not found
  }

  /**
   * Get summary of all collected data for preview
   */
  getDataSummary(): string {
    const combinedData = this.collectAllFormData();
    const validation = this.isAllDataComplete();

    let summary = 'Finance Application Summary:\n\n';

    summary += 'Personal Information:\n';
    summary += `- Name: ${combinedData.personalInfo.fullName}\n`;
    summary += `- Phone: ${combinedData.personalInfo.phoneNumber}\n`;
    summary += `- Email: ${combinedData.personalInfo.email}\n`;
    summary += `- Governorate: ${combinedData.personalInfo.governorate}\n\n`;

    summary += 'Work Details:\n';
    summary += `- Occupation: ${combinedData.workDetails.occupationType}\n`;
    summary += `- Job: ${combinedData.workDetails.jobTitle}\n`;
    summary += `- Income: ${combinedData.workDetails.monthlyIncome}\n\n`;

    summary += 'Car Information:\n';
    summary += `- Price: ${combinedData.referencePerson.totalPrice}\n`;
    summary += `- Down Payment: ${combinedData.referencePerson.downPayment}\n`;

    if (combinedData.referencePerson.hasSpecificCar === 'yes') {
      summary += `- Car: ${combinedData.referencePerson.specificCarBrand} ${combinedData.referencePerson.specificCarModel} (${combinedData.referencePerson.specificCarYear})\n`;
    } else if (combinedData.referencePerson.hasSpecificCar === 'no') {
      summary += `- Looking for: ${combinedData.referencePerson.selectedCarTypes.join(', ')}\n`;
      summary += `- Preferred: ${combinedData.referencePerson.searchCarBrand} ${combinedData.referencePerson.searchCarModel}\n`;
    }

    summary += `\nValidation: ${
      validation.isComplete ? 'Complete' : 'Missing ' + validation.missingFields.join(', ')
    }`;

    return summary;
  }

  /**
   * Get uploaded files from personal information service
   */
  getUploadedFiles(): { cardFrontFile: File | null; cardBackFile: File | null } {
    return this.personalInfoService.getUploadedFiles();
  }

  /**
   * Clear all form data from all components
   */
  clearAllData(): void {
    this.personalInfoService.clearFormData();
    this.workDetailsService.clearFormData();
    this.referencePersonService.clearFormData();
  }
}
