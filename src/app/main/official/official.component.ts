import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UploadDragAndDropDirective } from '../../directives/upload-drag-and-drop.directive';
import { MatListModule } from '@angular/material/list';
import { ListItemComponent } from "../../components/list/list-item/list-item.component";

@Component({
  selector: 'app-official',
  standalone: true,
  imports: [CommonModule, FormsModule, MatListModule, UploadDragAndDropDirective, ListItemComponent],
  templateUrl: './official.component.html',
  styleUrl: './official.component.scss'
})
export class OfficialComponent {
onDropFile($event: File[]) {
  console.log($event);
}
  selectedFile: File | null = null;
  fileName: string = '';
  loading: boolean = false;
  resultados: any[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.fileName = 'Nenhum arquivo selecionado';
    }
  }

  async consultarEdital() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file_consulta', this.selectedFile);

    this.loading = true;

    try {
      const response = await fetch('http://164.152.36.26/consulta.php', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor: ' + response.statusText);
      }

      const data = await response.json();
      if (data.links && Array.isArray(data.links)) {
        this.resultados = data.links.map((link: { url: string }, index: number) => ({
          label: `Resultado ${index + 1}`,
          url: link.url
        }));
      } else {
        alert('Nenhum resultado encontrado.');
      }
    } catch (error) {
      console.error('Erro ao consultar o edital:', error);
      alert('Erro ao processar o edital. Tente novamente.');
    } finally {
      this.loading = false;
    }
  }

  pesquisarOutroEdital() {
    this.resultados = [];
    this.selectedFile = null;
    this.fileName = 'Nenhum arquivo selecionado';
  }
}
