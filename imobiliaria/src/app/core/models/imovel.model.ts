export class Imovel {
  constructor(
    public id: string, 
    public titulo: string = "",
    public corretorId: number = 0,
    public tipo: string = "",
    public cidade: string = "",
    public preco: number = 0,
    public descricao: string = "",
    public imagemUrl: string = ""
  ) {}
}
