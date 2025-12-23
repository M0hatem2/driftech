import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { CarsService, Item, Data, Pagination } from '../../cars.service';

interface CarDisplay {
  id: number;
  make: string;
  model: string;
  year: string;
  price: string;
  status: string;
  bodyStyle: string;
  engine: string;
  transmission: string;
  image?: string;
  brand?: string;
  color?: string;
  km_driven?: string;
  location?: string;
}

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe, TitleCasePipe],
  templateUrl: './cars.html',
  styleUrls: ['./cars.scss']
})
export class Cars implements OnInit {
  
  // Component properties
  cars: CarDisplay[] = [];
  filteredCars: CarDisplay[] = [];
  
  // Search and filter properties
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedBrand: string = '';
  
  // View mode
  viewMode: 'grid' | 'list' = 'grid';
  
  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 12;
  totalItems: number = 0;
  
  // Loading and error states
  loading: boolean = false;
  error: string = '';
  
  // Modal state
  showEditModal: boolean = false;
  editingCar: CarDisplay | null = null;

  constructor(private carsService: CarsService) {}
  
  ngOnInit() {
    this.loadCars();
  }
  
  loadCars() {
    this.loading = true;
    this.error = '';
    
    this.carsService.getAllCars(
      this.currentPage,
      this.itemsPerPage,
      this.searchTerm || undefined,
      this.selectedBrand || undefined,
      this.selectedStatus || undefined
    ).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          // Map API data to component format
          this.cars = response.data.items.map(item => this.mapCarData(item));
          this.filteredCars = [...this.cars];
          
          // Update pagination
          const pagination = response.data.pagination;
          this.totalPages = pagination.last_page;
          this.totalItems = pagination.total;
          
          this.loading = false;
        } else {
          this.error = response.message || 'Failed to load cars';
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = 'Failed to load cars. Please try again.';
        this.loading = false;
        console.error('Error loading cars:', error);
      }
    });
  }

  private mapCarData(item: Item): CarDisplay {
    return {
      id: item.id,
      make: item.brand?.name || 'Unknown',
      model: item.model,
      year: item.year,
      price: item.price,
      status: item.condition || 'available',
      bodyStyle: item.body_type,
      engine: item.engine_cc,
      transmission: item.transmission,
      image: item.image_url || (item.images && item.images.length > 0 ? item.images[0].image_url : undefined),
      brand: item.brand?.name,
      color: item.color,
      km_driven: item.km_driven,
      location: item.location
    };
  }
  
  // Search functionality
  onSearch() {
    this.currentPage = 1; // Reset to first page when searching
    this.loadCars();
  }
  
  // Filter functionality
  onFilterChange() {
    this.currentPage = 1; // Reset to first page when filtering
    this.loadCars();
  }
  
  // Apply local filtering (for client-side filtering)
  filterCars() {
    let filtered = [...this.cars];
    
    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(car => 
        car.make.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.year.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.bodyStyle.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(car => car.status === this.selectedStatus);
    }
    
    // Apply brand filter
    if (this.selectedBrand) {
      filtered = filtered.filter(car => car.make.toLowerCase() === this.selectedBrand.toLowerCase());
    }
    
    this.filteredCars = filtered;
    this.calculateTotalPages();
  }
  
  // View mode switching
  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }
  
  // Car actions
  editCar(car: CarDisplay) {
    this.editingCar = { ...car };
    this.showEditModal = true;
  }
  
  deleteCar(car: CarDisplay) {
    if (confirm(`Are you sure you want to delete ${car.make} ${car.model}?`)) {
      this.carsService.deleteCar(car.id).subscribe({
        next: (response) => {
          if (response.status) {
            // Remove from local array
            this.cars = this.cars.filter(c => c.id !== car.id);
            this.filterCars();
            this.loadCars(); // Refresh from server
          } else {
            alert('Failed to delete car: ' + response.message);
          }
        },
        error: (error) => {
          alert('Failed to delete car. Please try again.');
          console.error('Error deleting car:', error);
        }
      });
    }
  }
  
  viewCar(car: CarDisplay) {
    // Implement view functionality
    console.log('Viewing car:', car);
  }
  
  // Modal functions
  closeModal() {
    this.showEditModal = false;
    this.editingCar = null;
  }
  
  saveCar() {
    if (this.editingCar && this.editingCar.id) {
      // Prepare data for update (convert CarDisplay back to Item format)
      const updateData: Partial<Item> = {
        model: this.editingCar.model,
        year: this.editingCar.year,
        color: this.editingCar.color,
        transmission: this.editingCar.transmission,
        engine_cc: this.editingCar.engine,
        body_type: this.editingCar.bodyStyle,
        price: this.editingCar.price,
        condition: this.editingCar.status,
        location: this.editingCar.location,
        km_driven: this.editingCar.km_driven
      };

      // Update car via service
      this.carsService.updateCar(this.editingCar.id, updateData).subscribe({
        next: (response) => {
          if (response.status && this.editingCar) {
            // Update local array
            const carId = this.editingCar.id!;
            const index = this.cars.findIndex(c => c.id === carId);
            if (index !== -1) {
              const updatedCar = { ...this.editingCar } as CarDisplay;
              this.cars[index] = updatedCar;
              this.filterCars();
            }
            this.closeModal();
            this.loadCars(); // Refresh from server
          } else {
            alert('Failed to update car: ' + response.message);
          }
        },
        error: (error) => {
          alert('Failed to update car. Please try again.');
          console.error('Error updating car:', error);
        }
      });
    }
  }
  
  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadCars();
    }
  }
  
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
  }
  
  // Track by function for performance
  trackByCarId(index: number, car: CarDisplay): number {
    return car.id;
  }
  
  // Helper function to format price
  formatPrice(price: string): string {
    // Remove any currency symbols and format the number
    const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericPrice);
  }
}
