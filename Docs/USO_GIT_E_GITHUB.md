# Padronização do Uso de Git e GitHub


Antes de criar uma nova branch, garanta que seu código está atualizado.
```sh
git checkout develop
git pull origin develop
```

Agora você pode criar uma branch para suas mudanças.
```sh
git checkout -b minha-nova-branch
```

Após modificar os arquivos necessários, adicione e salve suas mudanças no Git.
```sh
git add .
git commit -m "Descrição das alterações"
```

Manter sua branch sincronizada com o `develop` evita conflitos ao fazer merge ou pull request.
```sh
git merge develop
```
Se houver conflitos, resolva-os e salve as alterações:
```sh
git add .
git commit -m "Resolvendo conflitos"
```
Como alternativa ao merge, você pode usar `rebase`:
```sh
git rebase develop
```

