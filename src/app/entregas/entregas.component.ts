import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConexaoService } from '../service/conexao.service';
import { Entrega } from '../service/conexao.model';



interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.css'],
})
export class EntregasComponent {

  public observacao:boolean; //Utilizado no html com *ngIf, caso positivo -> exibirá um campo na forma de input para observação

  constructor(private formBuilder: FormBuilder,private conexao:ConexaoService){}

  checkoutForm = this.formBuilder.group({
    viewValue: '',
    bloco: '',
    num: '',
    obs:''
  });

  tipos: Tipo[] = [
    {value: '0', viewValue: 'Delivery'},
    {value: '1', viewValue: 'Cartas'},
    {value: '2', viewValue: 'Mercadorias'},
    {value: '3', viewValue: 'Farmácia'}
  ];

  selectedTipo = this.tipos[0].viewValue;

  restantes:Entrega[] = [
  
  ];

  concluidas:Entrega[] = [

  ];

  //Função usava para exibir campo input de Observação, lembrando que obervação não necessária para registro
 adicionarOBS(){
   if(this.observacao){
    this.observacao = false;
   }else{
     this.observacao = true;
   }
   console.log(this.observacao);

 }


  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex); //Nada acontece aqui. Somente mudança de ordem de serviços.
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
          //event.container contem o array de Concluidos, estaria pegando o valor atual do item que soltei.
          const concluidas = event.container.data[event.currentIndex];
          //Utilizando service de conexao com node para registro no banco de dados.
          this.conexao.entregasConcluidas(concluidas);
    
          
      
    }
  }

  onSubmit(){
    this.checkoutForm.value.bloco = this.checkoutForm.value.bloco.toUpperCase(); //Convertendo para letra Maiuscula para manter padrão no banco de dados.
    this.conexao.entregasPendentes(this.checkoutForm); //Acionando service de conexao com Node.
    this.restantes.push(this.checkoutForm.value); //Caso saia tudo da forma correta, é acionado o push no vetor.
  }
}
