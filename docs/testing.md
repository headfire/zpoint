# Точка сборки 3D - ZPleer - Методика тестирования

При всех действиях в браузере в консоли разработчика не должно быть ошибок и предупреждений

## Загрузка без параметров - Внешний вид

[Плеер без параметров](https://headfire.github.io/zpoint/zpleer/index.html) - [Локально](http://zpoint.localhost/zpleer/index.html)

### Внешний вид

Общее расположение
- На закладке - голубой фавикон и надпись "Точка сборки 3D" (без тире)
- Плеер занимает всю площадь браузера (без полей)
- Вверху и внизу две черные служебные полосы
- На экране чертежная доска (вид сверху-справа) 
- В углу доски метка A0 M1:1
- В верхнем левом углу - Помощь по движениям мыши (в 3D - режим, также сообщения об ошибках и сообщения пользовательского скрипта)

Слева вверху
- В углу голубой логотип и голубая надпись "Точка сборки 3D" (без тире) 
- Далее серым цветом - "Система создания 3D стерео-презентаций"
- При сжатии окна текст не переносится а обрезается
- При сжатии окна иконки справа всегда остаются навиду
- При сжатии окна текст подрезается а не переносится


Справа вверху
- Граф (Поделится) (отсутствует)
- Зачеркнутый глаз (Скрыть панели) (цвет серый)
- Знак вопроса (О проекте)  (цвет серый)

Слева внизу
- Стрелка вправо (Воспроизвести) (серая)
- Квадрат (Остановится) (серая)

Слева по центру
- Стрелка влево с полосой (Шаг назад) (нет)
- Квадрат (Остановится) (нет)
- Стрелка влево с полосой (Шаг вперед) (нет)

Справа внизу
- Камера (На место - Авторотация) (цвет серый)
- Перекрестие (Доска - Оси) (цвет серый)
- 3D (Перекресный взгляд - 3D TV) (цвет серый)
- Рамка (На полный экран) (цвет серый)

Линия времени
- Линии времени нет



### Базовые реакции

Мышь на основном поле
- Тащить левой клавишей - поворот сцены вокруг центра (камера двигается без наклона)
- Тащить правой клавишей - смещение сцены (камера двигается без наклона)
- Колесика - ближе - дальше


Мышь при наведении
- Все иконки при наведении делаются ярче и всплывает подсказка

Кнопка О проекте
- Кнопка срабатывает с первого раза
- При нажатии становится синей и открывается всплывающее окно с информацией о проекте
- Окно информации темное, полупрозрачное, с закругленными краями и темным кантом, в верхнем правом углу - кнопка закрытия
- Содержит разделы - О проекте - Поддержка 3D-проекторов, 3D-телевизоров - Контакты 
- Текст серый, ссылки (e-mail и адрес сайта) белые - подчеркнутые
- Шрифт достаточно крупный (16 px)
- Если текст убирается не полностью сбоку возникает прокрутка
- Окно закрывается при повторном нажатии на кнопку или на крестик в окне

Кнопка Скрыть панели
- Кнопка срабатывает с первого раза
- Иконка становится синей
- Через пять секунд после убратия курсора мыши панели исчезают
- Появляются почти сразу после введения курсора в зону панели (верхняя и нижняя работают отдельно)

Кнопка Камера
- Кнопка срабатывает с первого раза
- Иконка не меняется
- Камера переводится в исходную позицию

Кнопка 3D
- Кнопка срабатывает с первого раза
- Первый раз кнопка меняет цвет на синий - включается перекресный взгляд (тулбар остается единым)
- Второй  раз кнопка меняет цвет на красный - включается Side By Side (тулбар делается двойным)
- Третий раз - раз кнопка меняет цвет на серый - возврат в моно-режим


## Параметр margin

- [margin default](https://headfire.github.io/zpoint/zpleer/index.html) - [Локально]( http://zpoint.localhost/zpleer/index.html)
- [margin=off]( https://headfire.github.io/zpoint/zpleer/index.html?margin=off) - [Локально ]( http://zpoint.localhost/zpleer/index.html?margin=off)
- [margin=on]( https://headfire.github.io/zpoint/zpleer/index.html?margin=on) - [Локально ]( http://zpoint.localhost/zpleer/index.html?margin=on)



## Загрузка примеров Дао

Заголовок слайда должен отображаться серым цветом по центру верхней служебной полосы
Во вкладке браузера должно быть Точка сборки 3D | Название слайда

Построение фигуры Дао в объеме:
- [Слайд 01 Контур классического Дао](https://headfire.github.io/zpoint/zpleer/index.html?paper=dao&slide=slide_01_DaoClassic) - [Локально](http://zpoint.localhost/zpleer/index.html?paper=dao&slide=slide_01_DaoClassic)
- [Слайд 02 Контур Дао с отступом](https://headfire.github.io/zpoint/zpleer/index.html?paper=dao&slide=slide_02_DaoConcept) - [Локально](http://zpoint.localhost/zpleer/index.html?paper=dao&slide=slide_02_DaoConcept)
- [Слайд 03 Принцип построения сечений](https://headfire.github.io/zpoint/zpleer/index.html?paper=dao&slide=slide_03_DaoSecPrincipe) - [Локально](http://zpoint.localhost/zpleer/index.html?paper=dao&slide=slide_03_DaoSecPrincipe)
- [Слайд 04 Форма Дао из сечений ](https://headfire.github.io/zpoint/zpleer/index.html?paper=dao&slide=slide_04_DaoManySec) - [Локально](http://zpoint.localhost/zpleer/index.html?paper=dao&slide=slide_04_DaoManySec)
- [Слайд 05 Протягивание поверхности через сечения](https://headfire.github.io/zpoint/zpleer/index.html?paper=dao&slide=slide_05_DaoSkinning) - [Локально](http://zpoint.localhost/zpleer/index.html?paper=dao&slide=slide_05_DaoSkinning)
- [Слайд 06 Окончательная форма Дао](https://headfire.github.io/zpoint/zpleer/index.html?paper=dao&slide=slide_06_DaoComplete) - [Локально](http://zpoint.localhost/zpleer/index.html?paper=dao&slide=slide_06_DaoComplete)
- [Слайд 07 Форма Дао с основанием](https://headfire.github.io/zpoint/zpleer/index.html?paper=dao&slide=slide_07_DaoWithCase) - [Локально](http://zpoint.localhost/zpleer/index.html?paper=dao&slide=slide_07_DaoWithCase)

STL файлы Дао 
- [ Инь ]( https://headfire.github.io/zpoint/zpleer/slides/dao/slide_07_DaoWithCase/exp_001_shape.stl ) - [ Локально ]( http://zpoint.localhost/zpleer/slides/dao/slide_07_DaoWithCase/exp_001_shape.stl )
- [ Янь ]( https://headfire.github.io/zpoint/zpleer/slides/dao/slide_07_DaoWithCase/exp_002_shape.stl ) - [ Локлаьно ]( http://zpoint.localhost/zpleer/slides/dao/slide_07_DaoWithCase/exp_002_shape.stl )
- [ Основание ]( https://headfire.github.io/zpoint/zpleer/slides/dao/slide_07_DaoWithCase/exp_003_shape.stl ) - [ Локально ]( http://zpoint.localhost/zpleer/slides/dao/slide_07_DaoWithCase/exp_003_shape.stl )

## Загрузка обучающих примеров 

pass



