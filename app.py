list_example = [1, 'two', 3.0, 'four', 5]
print(list_example[1])

# 튜플, 주로 관련된 정보를 그룹화 하는데 사용
tuple_example = (1, 'two', 3.0, 'four', 5)
print(tuple_example[-1])

kospi_top10 = ['삼성전자', 'SK하이닉스', '현대차', '한국전력', '아모레퍼시픽', '제일모직', '삼성전자우', '삼성생명', 'NAVER', '현대모비스']

print("시가총액 5위:",kospi_top10[4])
print(kospi_top10[0:5])
print(kospi_top10[:5])
print(len(kospi_top10))

person = {"name": "John", "age": 30, "city": "New York"}

print("존의이름:",person["name"])
person["age"]=31
person["profession"]="painter"
del person["city"]

if "name" in person:print("Name is defined")



